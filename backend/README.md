# Learning Zone API - Standar


> ⚠️ No mezcles capas (nada de lógica en los controladores, ni queries en los routers). Cada archivo con su propósito.

---

## 🧪 Estilo de Código

- **pylint/black** (Python).
- Sangría: 2 espacios.
- Comillas: `'simples'` (mantén la consistencia).
- Variables en inglés y en **snake_case** (`user_data`, `total_price`).
- Constantes en **UPPER_CASE_SNAKE**.
- Nombres claros y descriptivos. No más `data1`, `res2`, ni cosas que ni tu mamá entiende.

---
## ⚖️ Framework Standards

Este backend habla FastAPI, así que seguimos estas reglas para mantener todo ordenado, claro y potente. Nada de rutas sueltas ni endpoints misteriosos. Aquí cada línea tiene propósito.

---

### ✅ Prefijos en las rutas

Organizamos las rutas por dominio funcional usando `APIRouter` con **prefijos claros y versionado** (`/api/v1/...`). Esto permite escalar sin hacer malabares.

**Ejemplo:**

```python
# src/routes/user_routes.py

from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)

@router.get("/profile")
def get_user_profile():
    return {"msg": "Perfil de usuario"}
```

```python
# src/main.py

from fastapi import FastAPI
from routes import user_routes

app = FastAPI()

app.include_router(user_routes.router)
```

> 🎯 **Regla:** Todos los routers deben usar un `prefix` y estar agrupados por dominio. ¡No más rutas flotando en `main.py`!

---

### 📝 Documentación con docstrings

Cada endpoint debe tener un **docstring descriptivo**. FastAPI usa esto para generar documentación automática en `/docs` y `/redoc`.

**Formato estándar del docstring:**

```python
"""
## Titulo

Breve descripción del endpoint.

### Parametros:
- `Parametro1 (tipo)`: descripción.
- `Parametro1 (tipo)`: descripción.

### Respuesta:
- `Retorna(tipo)`: descripción del objeto/respuesta.
"""
```

**Ejemplo real:**

```python
@router.post("/login")
def login_user(username: str, password: str):
    """
    # Validar usuario

    Inicia sesión de un usuario.

    - `username()`: str — Nombre de usuario.
    - `password()`: str — Contraseña del usuario.
    - `Retorna`: dict con token de autenticación y datos del usuario.
    """
    ...
```

> 🧠 Este docstring sirve tanto para devs como para autogenerar documentación externa si se usa Swagger UI, Redoc o tools como **FastAPI-Users**, **FastAPI-OpenAPI-Generator**, etc.

---

### 🛠 Otras reglas importantes

* Usa `status_code` explícito en las rutas (`status_code=201`, etc.).
* Agrupa los routers en un archivo `/routes/__init__.py` para importarlos fácilmente.
* Nombra los routers como `nombre_routes.py` y la variable como `router`.
* Define los modelos de request y response usando `pydantic.BaseModel`.

**Extra (buen gusto):**

```python
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str
```

```python
@router.post("/login", response_model=TokenResponse, status_code=200)
def login_user(payload: LoginRequest):
    """
    Autenticación de usuario.

    - `payload.username(str)`: Nombre de usuario
    - `payload.password(str)`: Contraseña
    - `Retorna`: token JWT y datos del usuario
    """
    ...
```

---

### 🚨 Antipatrones prohibidos

* ❌ Rutas en `main.py`
* ❌ Código sin docstring
* ❌ Nombres genéricos como `/do` o `/run`
* ❌ Prefijos mezclados (`/users`, `/usuario`, `/perfil_usuario`)

---

---

## 🔄 Control de Versiones

- Rama principal: `main` (solo código estable).
- Trabaja en ramas feature/fix: `feature/login`, `fix/user-auth`.
- Pull requests con descripción clara: qué se hizo, por qué, y cómo probarlo.
- Revisión de código obligatoria antes de merge.

---

## 🧰 Dependencias

- Instala paquetes con el gestor oficial del proyecto (`npm`, `pip`, etc.)
- Usa versiones fijas en el `package.json` o `requirements.txt`
- Nada de dependencias mágicas sin explicar en el PR.

---

## 🧼 Buenas Prácticas

- Cada función debe hacer **una sola cosa**.
- No hardcodees valores mágicos. Usa archivos `.env` o `config.js`.
- Manejo de errores centralizado.
- Documenta funciones complejas con comentarios breves.
- Escribe pruebas (unitarias al menos) para funciones clave.

---

## 🧪 Pruebas

- Usa un framework de testing apropiado (Jest, Pytest, etc.).
- Ubica las pruebas en `/tests`.
- Nombra los archivos como `miFuncion.test.js` o `test_mi_funcion.py`.
- Ejecuta las pruebas antes de cada merge.

---

## 💬 Comunicación del Equipo

- Dudas → canal de Slack/Discord del equipo.
- Toda decisión técnica debe quedar documentada (en el repo o en Notion/Wiki).
- No supongas, **pregunta**.

---

## ⚙️ Despliegue

- Archivos `.env` nunca se suben al repo.
- Usa variables de entorno para conexiones sensibles.
- Despliegue automático vía GitHub Actions / Docker / lo que uses.

---

## 🧙‍♂️ Extra: Filosofía del Código

> “El mejor código no es el que hace más cosas, sino el que **hace bien lo que debe hacer** y no estorba.”

---

¿Listo para hacer backend como un verdadero ninja del código? 🥷 Entonces sigue estas reglas y evita caos, bugs y mal karma.

