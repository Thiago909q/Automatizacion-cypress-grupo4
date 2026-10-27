# Automatización Cypress - Grupo 4

Repositorio compartido de pruebas end-to-end de ProLink, con Cypress y Page Object Model. La aplicación Laravel + React y la automatización siguen en repositorios separados.

## Repositorios

- Aplicación: https://github.com/SoftwareTercero2026/grupo4/tree/ultima-demo
- Automatización: https://github.com/Thiago909q/Automatizacion-cypress-grupo4

## POMs y autores

| POM | Integrante | Responsabilidad | Casos |
| --- | --- | --- | --- |
| `ServicesPage` | Tiago Puñal | Catálogo, detalle, búsqueda, filtros y ordenamiento | 6 |
| `LoginPage` | Thiago Alonso | Login, errores y visibilidad de contraseña | 4 |
| `RegisterPage` | Thiago Alonso | Registro y validaciones | 4 |
| `UserProfilePage` | Thiago Alonso | Actualización del nombre y acceso a configuración | 4 |
| `DashboardPage` | Thiago Alonso | Acceso al panel y cierre de sesión | 2 |

Hay 20 casos incluidos. Cada integrante agrega sus POMs y tests al mismo repositorio y actualiza esta tabla. Los POMs de autenticación devuelven una cadena de Cypress que entrega el siguiente POM o el actual para seguir el flujo.

## Prerrequisitos

- Node.js 22 o 24 y npm.
- PHP 8.2 o superior con `pdo_sqlite`, `mbstring`, `dom`, `fileinfo`, `openssl` y `tokenizer`.
- Composer 2 y Git.
- La rama `ultima-demo` de ProLink.

En la terminal, comprobar `node -v`, `php -v`, `composer --version` y `git --version`. No se necesita Java ni Python.

## Cómo ejecutar los tests

### 1. Ubicar los repositorios

Las dos carpetas pueden estar una al lado de la otra. ProLink contiene `artisan` en su raíz; esta versión no tiene una carpeta `backend` separada.

```bash
git clone --branch ultima-demo https://github.com/SoftwareTercero2026/grupo4.git grupo4
git clone https://github.com/Thiago909q/Automatizacion-cypress-grupo4.git Automatizacion-cypress-grupo4
```

Si ya están clonados, usar las carpetas existentes. Copiar `.env.example` a `.env` dentro del repo de automatización y configurar `APP_PATH` con la ruta al proyecto que contiene `artisan`.

Ejemplo para carpetas contiguas:

```dotenv
APP_PATH=../grupo4
E2E_PORT=8877
PHP_BINARY=php
COMPOSER_BINARY=composer
```

Si el proyecto se llama `grupo4-ultima-demo`, usar `APP_PATH=../grupo4-ultima-demo`. En Windows se pueden escribir rutas absolutas con barras `/`, por ejemplo `C:/Users/Thiago/Desktop/grupo4`.

### 2. Preparar la aplicación

Desde el repo de automatización:

```bash
npm ci
npm run setup:app
```

`setup:app` hace lo siguiente:

1. Aplica el parche de `patches/prolink-pom.patch`, o comprueba que ya esté aplicado. Si hay cambios locales incompatibles, se detiene para revisarlos.
2. Instala dependencias PHP y JavaScript de ProLink y construye React.
3. Ejecuta las migraciones en `.runtime/pom-e2e.sqlite`, una base exclusiva para las pruebas.
4. Carga `DemoMarketplaceSeeder`, con los 18 servicios que necesitan los tests del catálogo.

El parche agrega nueve `data-testid`, corrige el formulario de configuración para que envíe solo el nombre y configura Inertia con la ruta real `resources/js/pages`, respetando las minúsculas también en Linux. El backend rechaza el envío de email al guardar el perfil, aunque su valor no cambie.

Los cambios de ese parche también deben incorporarse a la rama del proyecto que el grupo entregue. No se sobrescribe el `.env` de Laravel ni se usa la base habitual del proyecto. Los tests de autenticación crean usuarios nuevos con correos únicos.

Antes de preparar, cerrar Vite. Si quedó un archivo `public/hot` en ProLink, eliminarlo después de cerrar Vite: las pruebas usan React ya construido.

### 3. Abrir Cypress

```bash
npm run test:open
```

Este comando inicia Laravel en `http://127.0.0.1:8877`, espera a que responda y abre Cypress. Elegir E2E Testing, un navegador y el archivo que se quiera ejecutar. No hace falta iniciar Laravel o Vite en otras terminales con esta modalidad. Al cerrar Cypress, el comando detiene Laravel.

### 4. Ejecutar todas las pruebas en consola

```bash
npm test
```

Inicia la aplicación, ejecuta todos los archivos `cypress/e2e/**/*.cy.js` con Electron y detiene Laravel al terminar. Un fallo devuelve un código de salida distinto de cero y puede generar una captura en `cypress/screenshots`.

Para ejecutar por sección:

```bash
npm run test:services
npm run test:login
npm run test:register
npm run test:profile
npm run test:dashboard
```

También se puede usar el CLI directamente: en una terminal `npm run start:app`; en otra `npm run cy:run` o `npx cypress open`. La URL debe coincidir con `E2E_PORT`; por defecto se usa 8877, no 8000.

## Organización y trabajo en grupo

- `cypress/support/pages`: los cinco POMs, con selectores centralizados en campos privados.
- `cypress/e2e`: casos de prueba y validaciones.
- `cypress/support/testUser.js`: datos para crear usuarios de prueba.
- `scripts`: preparación y ejecución de la aplicación local.
- `patches`: cambios necesarios en ProLink.

Cada integrante actualiza la rama principal, crea una rama para su parte y abre un pull request. Se reutilizan los POMs existentes para login o navegación. Los archivos nuevos terminan en `.cy.js` para que entren en `npm test`.

Cada computadora tiene su propio `.env` y su propia base de pruebas. No subir `.env`, `.runtime`, `node_modules`, capturas ni videos. Las esperas de autenticación y filtros corresponden a peticiones reales; no hay pausas fijas ni respuestas simuladas de la API.

## Acceso para corregir

Todos los integrantes necesitan permiso de escritura en este repo para incorporar su parte. Antes de entregar, dar acceso a `anibal317@gmail.com` con permiso Write en el repo de automatización y en el de ProLink, y comprobar que pueda entrar a ambos. Esta documentación no confirma que las invitaciones ya estén enviadas o aceptadas.

## Problemas frecuentes

- **No encuentra Laravel:** corregir `APP_PATH` para que apunte a la carpeta que contiene `artisan`.
- **Falta una extensión PHP:** habilitarla en el `php.ini` que usa la terminal.
- **No se encuentra Composer o PHP:** revisar el PATH, o indicar `COMPOSER_BINARY` / `PHP_BINARY` en `.env`.
- **Puerto ocupado:** cerrar la ejecución anterior o cambiar `E2E_PORT`.
- **Cypress no está descargado:** ejecutar `npx cypress install` y `npm run cy:verify`.
- **Cambió el frontend:** volver a ejecutar `npm run setup:app`.
- **El parche no coincide:** revisar la versión de ProLink y los cambios locales antes de volver a intentarlo.

En Linux, Cypress también necesita las bibliotecas indicadas en su documentación: https://docs.cypress.io/app/get-started/install-cypress

## Estado de validación

La instalación, el build de React, las migraciones y la carga de los 18 servicios se ejecutaron correctamente con el ZIP de `ultima-demo` proporcionado. Con el parche aplicado, pasaron los 128 tests existentes de Laravel, con 1078 assertions.

Además pasaron 23 comprobaciones HTTP de sesión, validaciones de autenticación y perfil, catálogo, detalle, búsqueda, categoría, rango de precios y ordenamiento. Estas comprobaciones no ejecutan el navegador.

Los 20 casos de Cypress están integrados, pero su ejecución en navegador está pendiente: la descarga oficial de la aplicación de Cypress devolvió “Site Unavailable” en el entorno de preparación. El comando de ejecución inicia Laravel y comunica la falta del ejecutable; no se presentan los casos E2E como aprobados. Hay que ejecutarlos en un equipo con Cypress instalado antes de entregar.
