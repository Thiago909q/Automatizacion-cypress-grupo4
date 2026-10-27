# Automatización Cypress - Servicios (Tiago_Automatizacion)

Esta rama contiene pruebas end-to-end de la sección **Servicios** del Marketplace del grupo 4. Cypress vive en este repositorio y prueba la aplicación ejecutándose localmente; no es necesario fusionar los repositorios.

## POMs y autores

| POM | Integrante | Responsabilidad |
|---|---|---|
| `ServicesPage` (`cypress/support/pages/servicesPage.js`) | Tiago Puñal | Navegación del catálogo y acciones de búsqueda, filtros y ordenamiento de servicios. |

Esta rama contiene actualmente un POM para el alcance de Servicios. Si la entrega grupal requiere tres o más POMs en total, hay que incorporar los POMs de las otras áreas y agregar aquí sus autores y responsabilidades.

## Prerrequisitos

- Node.js 20 o superior y npm, para instalar y ejecutar Cypress 16.
- PHP 8.2 o superior y Composer, para instalar y ejecutar el backend Laravel.
- El repositorio del Marketplace del grupo 4, configurado localmente (archivo `.env`, base de datos y datos de prueba).
- No se necesita Java ni Python para esta suite.

## Instalación de dependencias

En una terminal, desde la raíz de este repositorio de automatización:

```powershell
npm install
```

Si es una instalación nueva del Marketplace, instala también las dependencias del backend desde su carpeta `backend`:

```powershell
composer install
```

Completa la configuración de `.env`, la base de datos y los datos de prueba siguiendo las instrucciones del Marketplace.

## Cómo ejecutar los tests

1. En una terminal, entra a la carpeta `backend` del Marketplace e inicia Laravel:

   ```powershell
   php artisan serve --host=127.0.0.1 --port=8000
   ```

2. Si el Marketplace necesita compilar recursos del frontend, inicia también su servidor de desarrollo desde la carpeta que contiene el `package.json` correspondiente:

   ```powershell
   npm install
   npm run dev
   ```

   Mantén los servidores activos mientras corren las pruebas.

3. Comprueba que el catálogo esté disponible en `http://127.0.0.1:8000/services/browse?location_mode=none`.
4. Desde la raíz de este repositorio de automatización, ejecuta las pruebas en modo consola:

   ```powershell
   npm test
   ```

   O abre la interfaz de Cypress:

   ```powershell
   npm run test:open
   ```

Cypress usa `http://127.0.0.1:8000` como URL base, configurada en `cypress.config.js`.

## Casos cubiertos

La suite `cypress/e2e/services.cy.js` incluye seis pruebas:

1. Visualización del catálogo.
2. Apertura del detalle de un servicio.
3. Búsqueda por texto.
4. Filtro por categoría.
5. Filtro por rango de precios.
6. Ordenamiento por precio ascendente.

Los selectores y las acciones reutilizables están separados de los casos de prueba mediante `ServicesPage`. Los métodos, variables y nombres de las pruebas siguen la convención en inglés donde corresponde; los textos de la interfaz se mantienen en español para validar el contenido real de la aplicación.
