import sys
from pathlib import Path

# Configurar consola en UTF-8 en Windows para evitar errores con Unicode
if sys.platform.startswith("win"):
    import os

    os.system("chcp 65001 >nul")


def safe_print(text):
    """Evita UnicodeEncodeError si la consola no soporta ciertos caracteres."""
    try:
        print(text)
    except UnicodeEncodeError:
        # Reemplazo simple de emojis por texto plano
        fallback = (
            text.replace("✅", "[OK]").replace("❌", "[ERROR]").replace("⚠️", "[WARN]")
        )
        print(fallback)


def validar_requirements(path: Path) -> bool:
    try:
        raw = path.read_bytes()

        if b"\x00" in raw:
            safe_print(f"[❌] ¡Carácter NUL encontrado en {path.name}!")
            return False

        decoded = raw.decode("utf-8")
        lines = decoded.splitlines()

        for i, line in enumerate(lines, start=1):
            if line.strip() == "":
                continue
            if not any(c.isalnum() for c in line):
                safe_print(
                    f"[⚠️] Línea sospechosa en {path.name} (línea {i}): {repr(line)}"
                )
                return False

        safe_print(f"[✅] {path.name} validado correctamente.")
        return True

    except UnicodeDecodeError:
        safe_print(f"[❌] Codificación inválida en {path.name}. Debe ser UTF-8.")
        return False
    except Exception as e:
        safe_print(f"[❌] Error inesperado: {e}")
        return False


if __name__ == "__main__":
    req_file = Path("backend/requirements.txt")
    if not req_file.exists():
        safe_print(f"[❌] No se encontró {req_file}")
        sys.exit(1)

    is_valid = validar_requirements(req_file)
    sys.exit(0 if is_valid else 1)
