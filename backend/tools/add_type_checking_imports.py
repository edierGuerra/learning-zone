import ast
from pathlib import Path

TYPING_BLOCK = """
from typing import TYPE_CHECKING

if TYPE_CHECKING:
{imports}
"""

MODELS_PATH = Path("backend/models")


def get_string_annotations(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read(), filename=str(filepath))

    names = set()

    class Visitor(ast.NodeVisitor):
        def visit_AnnAssign(self, node):
            if isinstance(node.annotation, ast.Constant):
                value = node.annotation.value
                if isinstance(value, str) and value.isidentifier():
                    names.add(value)
            elif isinstance(node.annotation, ast.Subscript):
                ann = ast.unparse(node.annotation)
                for name in ann.replace("[", ",").replace("]", "").split(","):
                    name = name.strip().strip('"').strip("'")
                    if name.isidentifier():
                        names.add(name)

    Visitor().visit(tree)
    return sorted(names)


def insert_type_checking_block(filepath, used_classes):
    lines = filepath.read_text(encoding="utf-8").splitlines()
    import_lines = [
        f"    from .{model.lower()}_model import {model}" for model in used_classes
    ]
    typing_block = TYPING_BLOCK.format(imports="\n".join(import_lines))

    # Evita duplicados si ya existe TYPE_CHECKING
    if any("TYPE_CHECKING" in line for line in lines):
        return

    # Encuentra el último import
    insert_index = 0
    for i, line in enumerate(lines):
        if line.startswith("from") or line.startswith("import"):
            insert_index = i + 1

    new_lines = (
        lines[:insert_index]
        + [""]
        + typing_block.strip().splitlines()
        + [""]
        + lines[insert_index:]
    )

    filepath.write_text("\n".join(new_lines), encoding="utf-8")
    print(f"[✔] Agregado TYPE_CHECKING en: {filepath.relative_to(MODELS_PATH.parent)}")


def main():
    if not MODELS_PATH.exists():
        print("[ERROR] No se encontró el directorio backend/models")
        return

    for file in MODELS_PATH.glob("*_model.py"):
        used_classes = get_string_annotations(file)
        if used_classes:
            insert_type_checking_block(file, used_classes)


if __name__ == "__main__":
    main()
