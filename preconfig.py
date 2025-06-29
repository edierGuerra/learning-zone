import subprocess
import sys
import os
from pathlib import Path
import shutil

PRECOMMIT_CONFIG = """
repos:
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

def install_and_run_hooks():
    print("[INFO] Instalando hooks...")
    subprocess.run(["pre-commit", "install"], check=True)

    print("[INFO] Actualizando versiones de hooks...")
    subprocess.run(["pre-commit", "autoupdate"], check=True)

    print("[INFO] Ejecutando todos los hooks en todos los archivos...")
    result = subprocess.run(["pre-commit", "run", "--all-files"])
    if result.returncode != 0:
        print("[⚠️  AVISO] Algunos hooks fallaron. Revisa los errores en consola.")
    else:
        print("[✅] Todos los hooks pasaron correctamente.")

def main():
    check_and_install_precommit()
    write_config()
    install_and_run_hooks()
    print("[✅] ¡Pre-commit listo y funcionando sin morir en el intento!")

if __name__ == "__main__":
    main()
