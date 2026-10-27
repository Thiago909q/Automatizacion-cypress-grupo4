# Automatización Cypress - Grupo 4

Pruebas end-to-end de la aplicación ProLink Marketplace. Este repositorio contiene los tests de reservas; la aplicación Laravel que se prueba debe ejecutarse por separado.

## Cómo ejecutar los tests

### Prerrequisitos

- Node.js y npm instalados. Las pruebas se prepararon con Node.js 22 y Cypress 16.
- El proyecto de la aplicación (`grupo4`) configurado y disponible localmente.
- PHP, Composer y PostgreSQL para ejecutar la aplicación Laravel.

No se necesita Java ni Python para esta suite.

### Preparar la aplicación

En una terminal abierta en el proyecto de la aplicación Laravel, configura la conexión a la base de datos en `.env`. Luego aplica las migraciones y carga los datos de demostración:

```bash
php artisan migrate
php artisan db:seed
```

Inicia la aplicación en `http://127.0.0.1:8000` (por ejemplo, con `php artisan serve --host=127.0.0.1 --port=8000`). Si la aplicación requiere Vite para cargar sus recursos de frontend, inicia también su servidor de desarrollo desde esa misma carpeta.

### Instalar dependencias de Cypress

Desde la carpeta de este repositorio:

```bash
npm install
```

### Ejecutar las pruebas

Para ejecutar los tests de reservas:

```bash
npm run test:reservas
```

Para ejecutar todos los specs de Cypress en modo headless:

```bash
npm test
```

La configuración usa `http://127.0.0.1:8000` como `baseUrl`; asegúrate de que la aplicación esté corriendo antes de iniciar Cypress.
