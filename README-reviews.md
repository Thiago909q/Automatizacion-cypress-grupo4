# TP3 QA: reseñas con Cypress y POM, Tatiana Cortes: Reseñas


| Frontend y backend Laravel | [grupo4](https://github.com/SoftwareTercero2026/grupo4) |
| Automatización Cypress | [Automatizacion-cypress-grupo4](https://github.com/Thiago909q/Automatizacion-cypress-grupo4) |

## Requisitos

- Node.js 20 o superior y npm para Cypress 16.
- Git.
- Para ProLink: PHP 8.2 o superior, Composer 2, PostgreSQL y PHP con `pdo_pgsql` habilitado.
- Las dependencias instaladas y los servidores locales iniciados antes de ejecutar Cypress.

## Instalación

### Automatización

Cloná el repositorio de automatización o abrí la copia local y entrá a su raíz:

```powershell
git clone https://github.com/Thiago909q/Automatizacion-cypress-grupo4.git
Set-Location Automatizacion-cypress-grupo4
```

Instalá las dependencias:

```powershell
npm install
```

### ProLink (primera instalación local)

El proyecto Laravel está en `C:\xampp\htdocs\proyecto grupal\grupo4`. Seguí también su README. En PowerShell, una instalación local nueva comienza así:

```powershell
Set-Location 'C:\xampp\htdocs\proyecto grupal\grupo4'
Copy-Item .env.example .env
composer install
npm ci
```

Creá una base PostgreSQL local llamada `marketplace_db` desde `psql` o pgAdmin:

```sql
CREATE DATABASE marketplace_db;
```

Configurá `.env` con valores locales. Por ejemplo:

```dotenv
APP_NAME=ProLink
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=marketplace_db
DB_USERNAME=TU_USUARIO_POSTGRES_LOCAL
DB_PASSWORD=TU_PASSWORD_POSTGRES_LOCAL
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=log
```

Reemplazá los dos marcadores por credenciales de tu instalación local. No guardes `.env` en Git ni compartas esos valores.

Solo para preparar una base local nueva y descartable, completá la configuración de `.env` y ejecutá:

```powershell
php artisan key:generate
php artisan config:clear
php artisan migrate --seed
```

`migrate --seed` prepara tablas y datos de demostración. No lo ejecutes sobre la base local ya preparada para esta suite ni sobre datos que quieras conservar. No uses `migrate:fresh` para estas pruebas.

## Iniciar ProLink

Desde la raíz `C:\xampp\htdocs\proyecto grupal\grupo4`, abrí dos terminales y dejá ambos procesos activos.

Terminal 1, Laravel:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2, Vite:

```powershell
npm run dev -- --host 127.0.0.1
```

La URL local confirmada para la suite es `http://127.0.0.1:8000`. Antes de probar, verificá que la ruta pública cargue el componente real de reseñas, no otra aplicación Laravel en el puerto:

```powershell
$reviewPage = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/reviews/service/28'
if ($reviewPage.Content -notmatch 'Reviews/Service') {
	throw 'La URL no devolvió la página Inertia Reviews/Service de ProLink.'
}
```

## Datos locales de prueba

Para el entorno local confirmado:

- Servicio: `28`.
- Cuenta: `cliente.reembolso@prolink.com`.
- Reserva para ambos tests autenticados: `51`, propia de esa cuenta y servicio, estado `completed` y sin reseña.
- No uses la reserva `52`: ya tiene reseña.


## Ejecutar las pruebas

Desde la raíz del repositorio de automatización, prepará las cuatro variables locales conocidas y solicitá la contraseña de forma segura en la misma terminal PowerShell:

```powershell
$env:CYPRESS_BASE_URL = 'http://127.0.0.1:8000'
$env:CYPRESS_REVIEW_SERVICE_ID = '28'
$env:CYPRESS_REVIEW_EMAIL = 'cliente.reembolso@prolink.com'
$env:CYPRESS_REVIEW_BOOKING_ID = '51'
$securePassword = Read-Host 'Contraseña local de pruebas' -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
	$env:CYPRESS_REVIEW_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
} finally {
	[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
```

No escribas la contraseña en el comando, README, `.env` de automatización ni en un archivo versionado. Ejecutá cada comando por separado:

Suite de reseñas:

```powershell
npm run test:reviews
```

Suite completa:

```powershell
npm run test:e2e
```

Interfaz de Cypress:

```powershell
npm run cypress:open
```

Después de que Cypress termine, limpiá las variables temporales en otro comando:

```powershell
Remove-Item Env:CYPRESS_BASE_URL,Env:CYPRESS_REVIEW_SERVICE_ID,Env:CYPRESS_REVIEW_EMAIL,Env:CYPRESS_REVIEW_PASSWORD,Env:CYPRESS_REVIEW_BOOKING_ID -ErrorAction SilentlyContinue
$securePassword.Dispose()
```


## Cobertura y POM


| Page Object | 
| --- | --- |
| `ServiceReviewsPage` | 
| `ReviewsIndexPage` | 
| `ReviewFormPage` | 
| `LoginPage` | 

