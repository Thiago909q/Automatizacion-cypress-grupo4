# Automatización Cypress - Grupo 4

Pruebas end-to-end de la sección **Servicios** del Marketplace del grupo 4. Cypress se ejecuta desde este repositorio y visita la aplicación local del Marketplace; los repositorios no necesitan fusionarse.

## POMs y autores

| POM | Integrante | Responsabilidad |
|---|---|---|
| `ServicesPage` (`cypress/support/pages/servicesPage.js`) | Tiago Puñal | Navegación del catálogo y acciones de búsqueda, filtros y ordenamiento de servicios. |

Actualmente este repositorio contiene un POM, correspondiente al alcance de Servicios. Si la entrega grupal requiere tres o más POMs, deben incorporarse también los POMs de las otras áreas y completar aquí sus autores.

## Prerrequisitos

- Node.js y npm, para instalar y ejecutar Cypress.
- PHP 8.2 o superior y Composer, para levantar el backend Laravel del Marketplace.
- El Marketplace del grupo 4 instalado y configurado localmente.
- No se requiere Java ni Python para esta suite.

## Instalación

En una terminal, desde la raíz de este repositorio:

```powershell
npm install
```

Para una instalación nueva del Marketplace, instala también sus dependencias PHP desde `backend`:

```powershell
cd "C:\ruta\al\grupo4\backend"
composer install
```

Configura el archivo `.env`, la base de datos y los datos de prueba de acuerdo con las instrucciones del Marketplace.

## Cómo ejecutar los tests

1. Inicia el backend Laravel desde la carpeta `backend` del Marketplace:

   ```powershell
   php artisan serve --host=127.0.0.1 --port=8000
   ```

2. Si el Marketplace requiere el servidor de desarrollo del frontend, inicia también su comando de desarrollo en otra terminal, según los scripts disponibles en ese proyecto.
3. Comprueba que el catálogo responda en `http://127.0.0.1:8000/services/browse?location_mode=none`.
4. Desde la raíz de este repositorio, ejecuta la suite en modo consola:

   ```powershell
   npm test
   ```

   Para abrir la interfaz de Cypress:

   ```powershell
   npm run test:open
   ```

Cypress usa `http://127.0.0.1:8000` como `baseUrl` (`cypress.config.js`). No cierres el servidor del Marketplace mientras corren las pruebas.

## Casos cubiertos

La suite `cypress/e2e/services.cy.js` contiene seis pruebas:

- Visualización del catálogo.
- Apertura del detalle de un servicio.
- Búsqueda por texto.
- Filtro por categoría.
- Filtro por rango de precios.
- Ordenamiento por precio ascendente.
