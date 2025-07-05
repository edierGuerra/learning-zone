# ✨ Estándar entre Backend y Frontend

## 🔁 Rutas - Flujo General

* **Prefijo Backend:** `/api/v1/student`

---

## 🛠️ Actualizar Perfil

### 📤 Flujo de comunicación:

1. **Frontend**:

   * Envía un **token de acceso** en el encabezado `Authorization`.
   * Incluye un **JSON** en el body con la información a actualizar.

2. **Backend**:

   * **Valida el token** recibido.
   * Si el token es **válido**, actualiza los datos del estudiante.
   * Retorna un **código de estado HTTP** y un **mensaje** según el resultado de la operación.

3. **En caso de error**:

   * El backend responde con un código de estado acorde al tipo de error.
   * **No se actualiza la información del estudiante.**

4. **Respuesta del Frontend**:

   * Espera el código de estado y mensaje.
   * Si recibe un **200 OK**, ejecuta el microservicio que envía nuevamente el `access_token` al backend.
   * Espera como respuesta la **información del estudiante actualizada**, siempre y cuando no ocurra ningún error.

---

## 🧭 Rutas

| Función          | Ruta              | Método |
| ---------------- | ----------------- | ------ |
| Backend (API)    | `/update-profile` | `PUT`  |
| Frontend (vista) | `/profile`        | -      |

---

## 📨 Parámetros Esperados

* **Header:** `Authorization: Bearer <access-token>`
* **Body:** JSON con los datos del estudiante a actualizar

---

## 📥 Respuesta esperada

* **Código de estado HTTP** (`200`, `400`, `401`, etc.)
* **Mensaje** explicativo del resultado

---

## ⏳ Pendiente por definir:

* ¿Qué **datos del estudiante** pueden actualizarse?
* ¿Qué campos **no** se deben modificar?
---
## 🛠️ Notificaciones

### 📤 Flujo de comunicación:

1. **Frontend**:

   * Envía un **token de acceso** en el encabezado `Authorization`.

2. **Backend**:

   * **Valida el token** recibido.
   * Si el token es **válido**, busca las notificaciones asociadas al estudiante.
   * Retorna un **código de estado HTTP** y todas las notificaciones asociadas.

3. **En caso de error - Backend**:

   * El backend responde con un código de estado acorde al tipo de error y un mensaje.

4. **Respuesta del Frontend**:

   * Espera el código de estado y una lista de notificaciones(array).
   * Si el resultado es exitoso (`200 OK`), se renderizan todas las notificaciones(asociadas).

5. **En caso de error - Frontend**
    * Renderiza mensaje segun el error.
---

## 🧭 Rutas

| Función          | Ruta              | Método          |
| ---------------- | ----------------- | --------------- |
| Backend (API)    | `/notifications`  | `get`           |
| Frontend (vista) | `/notifications`  | `get`           |

---

## 📨 Parámetros Esperados

* **Header:** `Authorization: Bearer <access-token>`

---

## 📥 Respuesta esperada
* **Código de estado HTTP:** `200`
* **Lista(Array):** `list_notifications`
---
