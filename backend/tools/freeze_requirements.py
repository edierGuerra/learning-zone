import subprocess
from pathlib import Path
import sys
import os

# Forzar UTF-8 en Windows para evitar errores de encoding
if sys.platform.startswith("win"):
    os.system("chcp 65001 >nul")


def crear_entorno_virtual(venv_path: Path):
    print("[INFO] No se encontró el entorno virtual, se procederá a crearlo...")
    subprocess.run([sys.executable, "-m", "venv", str(venv_path)], check=True)
    print("[OK] Entorno virtual creado correctamente.")


def obtener_python_venv(venv_path: Path) -> Path:
    if sys.platform.startswith("win"):
        return venv_path / "Scripts" / "python.exe"
    else:
        return venv_path / "bin" / "python"


def freeze_requirements(output_path: Path):
    venv_path = Path("backend/venv")
    python_venv = obtener_python_venv(venv_path)

    if not python_venv.exists():
        crear_entorno_virtual(venv_path)

    if not python_venv.exists():
        print("[ERROR] No se pudo encontrar ni crear el entorno virtual.")
        sys.exit(1)

    print("[INFO] Generando requirements.txt desde pip freeze...")

    result = subprocess.run(
        [str(python_venv), "-m", "pip", "freeze"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    if result.returncode != 0:
        print("[ERROR] pip freeze falló:")
        print(result.stderr)
        sys.exit(1)

    output_path.write_text(result.stdout, encoding="utf-8")
    print("[OK] requirements.txt actualizado correctamente.")


if __name__ == "__main__":
    freeze_requirements(Path("backend/requirements.txt"))
