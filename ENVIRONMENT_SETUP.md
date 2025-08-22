# 🔐 Configuración de Variables de Entorno

## Configuración Inicial

1. **Copia el archivo de ejemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`** con tus credenciales reales:

### 📧 SendGrid (Para emails)
```bash
SENDGRID_API_KEY=SG.tu_api_key_real_aqui
SENDGRID_TEMPLATE_SUGGESTION_ID=d-tu_template_id
SENDGRID_TEMPLATE_REGISTER_ID=d-tu_template_id
SENDGRID_TEMPLATE_PASSWORD_ID=d-tu_template_id
SENDGRID_TEMPLATE_NOTIFICATION_ID=d-tu_template_id
```

### 🤖 Google Gemini AI
```bash
GEMINI_API_KEY=tu_gemini_api_key_aqui
```

### 📸 Cloudinary (Para imágenes)
```bash
CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 🔒 Seguridad
```bash
TOKEN_KEY=genera_una_clave_secreta_larga_y_aleatoria
ADMIN_PASSWORD=crea_una_contraseña_segura
```

## 🚀 Ejecutar con Docker

Una vez configuradas las variables de entorno:

```bash
docker-compose up -d
```

## ⚠️ Importante

- **NUNCA** commitees el archivo `.env` al repositorio
- El archivo `.env.example` es solo para referencia
- Mantén tus credenciales seguras y no las compartas

## 🔗 Enlaces Útiles

- [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Cloudinary Dashboard](https://cloudinary.com/console)
