import secrets

# Generar un token aleatorio como lo hace el backend
new_token = secrets.token_urlsafe(32)

print(f"Nuevo token generado: {new_token}")
print(f"URL de confirmación:")
print(f"https://cjetechnology.org/#/confirmEmailRegister?token={new_token}")

# También mostrar el token que sabemos que funciona
working_token = "f8c24c0b-ce95-42e8-b6be-88dee5816768"
print(f"\nToken de trabajo conocido: {working_token}")
print(f"URL con token conocido:")
print(f"https://cjetechnology.org/#/confirmEmailRegister?token={working_token}")
