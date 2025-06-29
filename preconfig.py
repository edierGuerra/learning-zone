import subprocess
import sys
import os
from pathlib import Path
import shutil

PRECOMMIT_CONFIG = """
repos:
  - repo: local
    hooks:
      - id: install-deps
        name: Instalar dependencias antes del commit
        entry: python backend/tools/install_deps.py
        language: system
        pass_filenames: false

  - repo: local
    hooks:
      - id: update-requirements
        name: Actualizar requirements.txt con pip freeze
        entry: python backend/tools/freeze_requirements.py
        language: system
        types: [python]
        always_run: true
        pass_filenames: false

  - repo: local
    hooks:
      - id: check-requirements
        name: Validar requirements.txt
        entry: python backend/tools/check_requirements.py
        language: system
        types: [text]

  - repo: https://github.com/psf/black
    rev: 24.3.0
    hooks:
      - id: black
        files: ^backend/

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.4
    hooks:
      - id: ruff
        args: [--fix]
        files: ^backend/

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files
"""

def check_and_install_precommit():
    if shutil.which("pre-commit") is None:
        print("[INFO] pre-commit no está instalado. Instalando...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pre-commit"], check=True)
    else:
        print("[OK] pre-commit ya está instalado.")

def write_config():
    config_path = Path(".pre-commit-config.yaml")
    with config_path.open("w", encoding="utf-8") as f:
        f.write(PRECOMMIT_CONFIG.strip())
    print(f"[OK] Archivo {config_path} creado/actualizado.")

def auto_import_typing_dependencies():
    script_path = Path("backend/tools/add_type_checking_imports.py")
    if script_path.exists():
        print("[INFO] Ejecutando análisis de anotaciones TYPE_CHECKING...")
        subprocess.run([sys.executable, str(script_path)], check=True)
    else:
        print("[WARN] Script de anotaciones TYPE_CHECKING no encontrado en backend/tools/")

def install_and_run_hooks():
    print("[INFO] Instalando hooks...")
    subprocess.run(["pre-commit", "install"], check=True)

    print("[INFO] Actualizando versiones de hooks...")
    subprocess.run(["pre-commit", "autoupdate"], check=True)

    auto_import_typing_dependencies()

    print("[INFO] Ejecutando todos los hooks en todos los archivos...")
    result = subprocess.run(["pre-commit", "run", "--all-files"])
    if result.returncode != 0:
        print("[⚠️  AVISO] Algunos hooks fallaron. Esto no es un error del script, sino del estado del código.")
        print("👉 Solución sugerida: Revisa la salida anterior, corrige los errores que indican los hooks (como Ruff o Black), vuelve a hacer 'git add' y reintenta el commit.")
    else:
        print("[✅] Todos los hooks pasaron correctamente.")

def main():
    check_and_install_precommit()
    write_config()
    install_and_run_hooks()
    print("[✅] Pre-commit listo y funcionando sin morir en el intento!")

if __name__ == "__main__":
    main()
