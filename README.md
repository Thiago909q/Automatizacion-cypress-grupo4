# Automatización Cypress - Grupo 4

Repositorio del grupo para pruebas end-to-end con Cypress. La aplicación bajo prueba puede estar en otro repositorio; Cypress la abre en el navegador usando la URL local configurada para cada suite.

## Prerrequisitos

- Node.js 24 y npm. Usé Node v24.19.0 y Cypress 16.2.0; Cypress se instala con las dependencias del repositorio.
- Git para clonar el repositorio.
- No se necesita Java ni Python para ejecutar estas pruebas.
- Para ProLink: PHP 8.2 o superior dentro de la rama 8.x, Composer, las extensiones requeridas por Laravel (incluida `pdo_pgsql`) y PostgreSQL instalado y funcionando.

## Instalación

Clona el repositorio y entra a su carpeta:

```powershell
git clone --branch Automatizacion-thiago-alonso https://github.com/Thiago909q/Automatizacion-cypress-grupo4.git
cd Automatizacion-cypress-grupo4
```

Instala las dependencias de Cypress:

```powershell
npm ci
```

## Cómo ejecutar los tests

Después de preparar ProLink con los pasos de abajo, ejecutar desde la raíz del repositorio de automatización:

```powershell
npm test
```

Este comando ejecuta las suites E2E en modo consola. Para abrir Cypress y seleccionar las pruebas desde la interfaz:

```powershell
npm run test:open
```

Las suites que dependen de una aplicación local requieren que el servidor esté iniciado antes de ejecutar Cypress. La URL base y los comandos para levantar la aplicación pueden variar según la rama y están indicados en el README correspondiente.

## Organización por ramas

Cada integrante puede desarrollar y documentar sus pruebas en su propia rama. El README de esa rama debe identificar los autores y POMs incluidos, describir los casos cubiertos y detallar cualquier requisito adicional de la aplicación bajo prueba.

En `main` se mantiene la configuración general del repositorio. Consultar el README de la rama de trabajo para conocer el alcance específico de sus pruebas.


## TP3 de ProLink — Thiago Alonso

En mi rama `Automatizacion-thiago-alonso` desarrollé estos cuatro POMs. Están en `cypress/support/pages`, con selectores privados centralizados y acciones que devuelven cadenas de Cypress con el POM actual o siguiente. Los tests contienen las assertions y los nombres del código están en inglés.

| POM (autor: Thiago Alonso) | Spec | Cantidad |
| --- | --- | --- |
| `LoginPage.js` | `login.cy.js` | 9 |
| `RegisterPage.js` | `register.cy.js` | 16 |
| `UserProfilePage.js` | `user-profile.cy.js` | 12 |
| `DashboardPage.js` | `dashboard.cy.js` | 6 |

Son **43 casos en total**. Amplié las pruebas para cubrir datos inválidos, valores límite y qué pasa después de corregir un error:

- **Login:** credenciales correctas, contraseña incorrecta, campos obligatorios, mostrar y ocultar contraseña, correo sin cuenta, correo incompleto, correo con mayúsculas y espacios, acceso al login con sesión iniciada y volver a intentar después de una contraseña incorrecta.
- **Registro:** registro correcto, confirmación distinta, contraseña débil, correo repetido, campos vacíos, correo incompleto, nombre con números o demasiado corto, contraseña de menos de 8 caracteres o sin mayúscula, minúscula o número, contraseña válida de exactamente 8 caracteres, normalización de nombre y correo, visibilidad independiente de las dos contraseñas y acceso al registro con sesión iniciada.
- **Perfil:** guardar y recargar, correo enmascarado y deshabilitado, rechazar números, acceso sin sesión, nombres de solo espacios, de 1 carácter o de más de 100, aceptar los límites de 2 y 100 caracteres, tildes y signos permitidos, normalización de espacios y corregir un nombre inválido. También compruebo que al guardar se envíe solo `name`.
- **Dashboard:** acceso sin sesión, protección después del logout, saludo del usuario conectado, panel personal, sesión al recargar, navegación al perfil y protección del perfil después de cerrar sesión.

## 1. Preparar ProLink

Clonar la aplicación y entrar en su carpeta:

```cmd
git clone --branch ultima-demo https://github.com/SoftwareTercero2026/grupo4.git
cd grupo4
composer install
npm ci
```

Crear `.env` a partir de `.env.example` si todavía no existe. En CMD de Windows:

```cmd
copy .env.example .env
```

En PowerShell usar `Copy-Item .env.example .env`; en Linux o macOS, `cp .env.example .env`. Crear una base vacía en PostgreSQL, por ejemplo `prolink_testing`, desde pgAdmin o con SQL:

```sql
CREATE DATABASE prolink_testing;
```

Configurar el `.env` de ProLink con los datos de la instalación local:

```dotenv
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=prolink_testing
DB_USERNAME=TU_USUARIO
DB_PASSWORD=TU_PASSWORD
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
MAIL_MAILER=log
```

En una instalación nueva, generar la clave y crear las tablas:

```cmd
php artisan key:generate
php artisan config:clear
php artisan migrate
```

No hacen falta datos de demostración: los tests crean sus propios usuarios. Si ProLink ya está instalado, conservar el `.env` y la clave existentes; ejecutar `php artisan migrate` solo si hay migraciones pendientes. No usar `migrate:fresh`, porque borra las tablas.

Desde la raíz de ProLink, donde está `artisan`, iniciar la aplicación y dejar la terminal abierta:

```cmd
composer run dev
```

Comprobar que abra en `http://127.0.0.1:8000`. Como alternativa, iniciar `php artisan serve --host=127.0.0.1 --port=8000` y `npm run dev` en dos terminales. La instalación de la aplicación también está explicada en el [README de ProLink](https://github.com/SoftwareTercero2026/grupo4/tree/ultima-demo).

## 2. Ejecutar la automatización

Abrir otra terminal en la carpeta `Automatizacion-cypress-grupo4` que se clonó al principio. Si todavía no se instalaron sus dependencias, ejecutar `npm ci` en esa carpeta. Mantener PostgreSQL, Laravel y Vite funcionando durante toda la ejecución.

Con PostgreSQL funcionando y ProLink disponible en `http://127.0.0.1:8000`, ejecutar desde la raíz de automatización:

```cmd
npm test
```

Para abrir la interfaz contra el mismo servidor:

```cmd
npm run test:open
```

Los tests crean usuarios con correos únicos y modifican solamente el perfil de esos usuarios. No necesitan cuentas demo ni borrar datos existentes.

Los comandos `npm test` y `npm run test:open` ya apuntan a `http://127.0.0.1:8000`. Usan ProLink con PostgreSQL y requieren que la aplicación esté iniciada. No hace falta indicar la URL en cada ejecución ni crear un `.env` en automatización.

Para ejecutar un grupo por separado:

```cmd
npm run test:login
npm run test:register
npm run test:profile
npm run test:dashboard
```

## Resultado

Al ejecutar `npm test` pasaron **43 de 43 casos**: Dashboard 6/6, Login 9/9, Registro 16/16 y Perfil 12/12. Cypress mostró `All specs passed!`, sin fallidos, pendientes ni omitidos, en 1 minuto y 22 segundos. La advertencia de deprecación de Electron no impidió completar las pruebas.

## Repositorios

- [Automatización, rama de Thiago](https://github.com/Thiago909q/Automatizacion-cypress-grupo4/tree/Automatizacion-thiago-alonso).
- [ProLink, rama ultima-demo](https://github.com/SoftwareTercero2026/grupo4/tree/ultima-demo).
