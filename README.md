# PRIOCOHORT - Sistema de Consentimiento Informado

Sistema web para la gestión de consentimientos informados del estudio PRIOCOHORT de Osakidetza.

## 📋 Descripción

Aplicación web que permite a los participantes del estudio PRIOCOHORT completar y firmar digitalmente su consentimiento informado. El sistema valida los códigos de participante, genera PDFs personalizados, sincroniza con Dropbox, y envía notificaciones por email.

## ✨ Características

- **Validación de códigos**: Verifica DNI y códigos TXPR contra bases de datos CSV
- **Formulario interactivo**: Interfaz paso a paso para completar el consentimiento
- **Generación de PDF**: Crea documentos PDF con las respuestas del participante
- **Firma digital**: Captura de firma manuscrita en canvas
- **Sincronización Dropbox**:
  - Almacena PDFs firmados
  - Guarda respuestas en CSV
  - Sincronización automática de bases de datos
- **Notificaciones email**: Envío automático vía SendGrid
- **Modo fire-and-forget**: La interfaz no se bloquea esperando email/CSV

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Generación PDF**: PDFKit
- **Email**: SendGrid API
- **Almacenamiento**: Dropbox API
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Deployment**: Railway

## 📦 Requisitos

- Node.js 22.x o superior
- npm 9.x o superior
- Cuenta de Dropbox (con API configurada)
- Cuenta de SendGrid (con API key)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jokin1969/PRIOCOHORT-CI.git
cd PRIOCOHORT-CI
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` y crea tu `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Servidor
PORT=8080

# Dropbox API
DROPBOX_REFRESH_TOKEN=tu_refresh_token
DROPBOX_APP_KEY=tu_app_key
DROPBOX_APP_SECRET=tu_app_secret

# SendGrid
SENDGRID_API_KEY=SG.tu_api_key
SENDGRID_FROM_EMAIL=tu@email.com
```

### 4. Preparar archivos de datos

Coloca en `/data/`:
- `dni.csv`: Base de datos de DNIs válidos
- `txpr.csv`: Códigos TXPR de participantes

Formato de `dni.csv`:
```csv
DNI
12345678A
87654321B
```

Formato de `txpr.csv`:
```csv
TXPR
TXPR001
TXPR002
```

### 5. Ejecutar la aplicación

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:8080`

## ⚙️ Configuración de Dropbox

### 1. Crear aplicación en Dropbox

1. Ve a [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Crea una nueva app con permisos de lectura/escritura
3. Obtén el App Key y App Secret

### 2. Generar Refresh Token

```bash
# Seguir el flujo OAuth2 de Dropbox
# El refresh token no expira y permite regenerar access tokens
```

### 3. Estructura de carpetas en Dropbox

```
/ConnectingPrion/
└── priocohort/
    ├── databases/
    │   ├── dni.csv
    │   └── txpr.csv
    ├── Signed CI/
    │   └── [PDFs firmados]
    └── responses/
        └── CI_responses.csv
```

## 📧 Configuración de SendGrid

### 1. Crear cuenta y API key

1. Regístrate en [SendGrid](https://sendgrid.com/)
2. Ve a Settings → API Keys
3. Crea un nuevo API key con permisos de envío

### 2. Verificar remitente

**Opción A - Dominio completo** (Recomendado):
1. Settings → Sender Authentication → Authenticate Your Domain
2. Sigue el wizard y añade registros DNS
3. Permite enviar desde cualquier email de tu dominio

**Opción B - Email individual**:
1. Settings → Sender Authentication → Verify a Single Sender
2. Verifica el email específico que usarás

## 🏗️ Estructura del Proyecto

```
PRIOCOHORT-CI/
├── data/                          # Archivos CSV locales
│   ├── dni.csv
│   └── txpr.csv
├── public/                        # Archivos estáticos
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── information-content.js
│   └── index.html
├── src/
│   ├── controllers/
│   │   └── consent.controller.js  # Lógica de consentimientos
│   ├── services/
│   │   ├── csv-responses.service.js   # Gestión CSV respuestas
│   │   ├── dropbox-sync.service.js    # Sincronización Dropbox
│   │   ├── dropbox.service.js         # Cliente Dropbox
│   │   ├── email.service.js           # Envío emails SendGrid
│   │   └── pdf.service.js             # Generación PDFs
│   └── utils/
│       └── validators.js          # Validación DNI/TXPR
├── server.js                      # Punto de entrada
├── package.json
└── README.md
```

## 🔄 Flujo de la Aplicación

1. **Validación inicial**
   - Usuario ingresa DNI
   - Sistema valida contra `dni.csv`
   - Usuario ingresa código TXPR
   - Sistema valida contra `txpr.csv`

2. **Formulario de consentimiento**
   - Información del participante
   - Decisiones sobre el estudio
   - Opciones de biobanco
   - Firma digital

3. **Procesamiento (fire-and-forget)**
   - Genera PDF para participante → Dropbox
   - Genera PDF para investigadora → Email
   - Guarda respuestas en CSV → Dropbox
   - Muestra confirmación inmediatamente
   - Email y CSV se procesan en segundo plano

4. **Almacenamiento**
   - PDF firmado en `/ConnectingPrion/priocohort/Signed CI/`
   - Respuestas añadidas a `CI_responses.csv`
   - Email enviado a `jcastilla@cicbiogune.es`

## 📊 Formato CSV de Respuestas

El archivo `CI_responses.csv` contiene:

| Campo | Valores |
|-------|---------|
| codigo_verificacion | TXPR001, TXPR002... |
| leido_hoja_informacion | SI, NO |
| recibido_informacion | SI, NO |
| comprendo | SI, NO |
| consentimiento_uso_muestras | SI, NO |
| consentimiento_participacion | SI, NO |
| info_estado_genetico | SI-SOLICITO, NO-QUIERO |
| info_biomarcadores | SI-SOLICITO, NO-QUIERO |
| incorporacion_biobanco | SI, NO |
| tipo_donacion | CODIFICADAS, ANONIMIZADAS, ND |
| uso_autorizado | SOLO-PRION, CUALQUIER, ND |
| destruccion_excedente | SI, NO |

**Nota**: Los campos `tipo_donacion` y `uso_autorizado` serán "ND" cuando se solicita destrucción de muestras.

## 🚢 Deployment en Railway

### 1. Conectar repositorio

1. Crea cuenta en [Railway](https://railway.app/)
2. New Project → Deploy from GitHub
3. Selecciona el repositorio PRIOCOHORT-CI

### 2. Configurar variables de entorno

En Railway Settings → Variables, añade:

```
PORT=8080
DROPBOX_REFRESH_TOKEN=...
DROPBOX_APP_KEY=...
DROPBOX_APP_SECRET=...
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...
```

### 3. Configurar deployment

- **Branch**: `claude/review-repo-docs-01UFH1UNhnmyQEhzCgyz6rEE` (o tu rama principal)
- **Build Command**: `npm ci`
- **Start Command**: `npm start`

### 4. Limpiar cache (si es necesario)

Si los cambios no se despliegan:
- Settings → Clear Build Cache
- Trigger manual redeploy

## 🧪 Desarrollo

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Utiliza `nodemon` para reiniciar automáticamente al detectar cambios.

### Estructura de branches

- `claude/review-repo-docs-01UFH1UNhnmyQEhzCgyz6rEE`: Rama de desarrollo actual
- `Rama-01`: Backup/producción

## 📝 Logs y Debugging

La aplicación emite logs detallados:

```
✅ Successful operations
⚠️  Warnings
❌ Errors
📧 Email operations
📊 CSV operations
🔄 Sync operations
⬆️  Upload operations
```

Monitoriza los logs en Railway:
- Dashboard → Tu servicio → Deployments → View Logs

## 🔒 Seguridad

- ✅ Validación de DNI con algoritmo oficial
- ✅ Variables de entorno para credenciales
- ✅ API keys nunca en código fuente
- ✅ HTTPS en producción (Railway)
- ✅ Refresh tokens para Dropbox (no expiran)
- ✅ SendGrid API (más seguro que SMTP)

## 🐛 Troubleshooting

### Email no llega

1. Verifica que `SENDGRID_API_KEY` es correcta
2. Confirma que el remitente está verificado en SendGrid
3. Revisa spam/correo no deseado
4. Comprueba logs: `Status code: 202` = enviado correctamente

### CSV no se crea

1. Verifica que el directorio `/ConnectingPrion/priocohort/responses/` existe en Dropbox
2. Comprueba permisos de la app en Dropbox
3. Revisa que `DROPBOX_REFRESH_TOKEN` es válido

### Dropbox sync falla

1. Regenera el refresh token si ha expirado
2. Verifica App Key y App Secret
3. Comprueba que los CSV existen en Dropbox

### Build falla en Railway

1. Limpia el build cache
2. Verifica que `package-lock.json` está actualizado
3. Revisa que todas las dependencias están en `package.json`

## 📄 Licencia

ISC

## 👥 Autor

Proyecto desarrollado para el estudio PRIOCOHORT de Osakidetza.

## 📞 Contacto

Para consultas sobre el estudio, contactar con:
- Dra. Izaro Kortazar: izaro.kortazarzubizarreta@osakidetza.eus
- Dr. Joaquín Castilla: jcastilla@cicbiogune.es
