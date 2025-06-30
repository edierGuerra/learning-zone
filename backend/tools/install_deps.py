import subprocess
from pathlib import Path
import sys
import os
import io

# ------------------------
# Configuración de entorno
# ------------------------

# Para evitar errores de codificación en Windows (emoji, tildes, etc.)
if sys.platform.startswith("win"):
    os.system("chcp 65001 >nul")

# Forzar salida estándar a UTF-8 para soportar caracteres especiales
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# ------------------------
# Ruta al archivo de dependencias
# ------------------------
req_path = Path("backend/requirements.txt")


# ------------------------
# Función para detectar codificación segura
# ------------------------
def safe_read_requirements(path: Path) -> str:
    encodings_to_try = ["utf-8", "utf-8-sig", "latin1", "utf-16"]
    for enc in encodings_to_try:
        try:
            content = path.read_bytes()
            decoded = content.decode(enc)

            # Si tiene NUL, lo limpiamos
            if b"\x00" in content:
                print(
                    "[⚠️] Se detectaron caracteres NUL en requirements.txt. Limpiando..."
                )
                cleaned = decoded.replace("\x00", "")
                path.write_text(cleaned, encoding="utf-8")
                print(
                    "[✅] requirements.txt limpiado y reescrito con codificación UTF-8."
                )
                return "utf-8"

            return enc
        except Exception:
            continue
    raise Exception("[❌] No se pudo leer el archivo con ninguna codificación válida.")


# ------------------------
# Ejecución principal
# ------------------------
def main():
    if not req_path.exists():
        print(f"[❌] No se encontró {req_path}")
        sys.exit(1)

    encoding_detected = safe_read_requirements(req_path)
    print(
        f"[ℹ️] Leyendo requirements.txt con codificación detectada: {encoding_detected}"
    )

    try:
        subprocess.run(["pip", "install", "-r", str(req_path)], check=True)
        print("[✅] Dependencias instaladas correctamente.")
    except subprocess.CalledProcessError as e:
        print(
            f"[❌] Falló la instalación de dependencias. Código de salida: {e.returncode}"
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
