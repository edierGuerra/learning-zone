# routes/utils.py


def generate_profile_prefix(name: str, last_name: str) -> str:
    """
    ## Generar prefijo

    Permite generar un prefijo en base a el nombre y el apellido del estudiante.

    ### Parámetros:
    - `name(str):` Nombre del estudiante.
    - `last_name(str)`: Apellido del estudiante.

    ### Retornos:
    - `String`: Prefijo del nombre y el apellido del estudiante.
    """

    first_letter_name: str = name[0].upper()
    first_letter_last_name: str = last_name[0].upper()

    prefix: str = first_letter_name + first_letter_last_name

    return prefix
