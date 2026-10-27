# Automatización Cypress - Grupo 4

Repositorio del grupo para pruebas end-to-end con Cypress. La aplicación bajo prueba puede estar en otro repositorio; Cypress la abre en el navegador usando la URL local configurada para cada suite.

## Prerrequisitos

- Node.js compatible con Cypress 16 (Node.js 20 o superior) y npm.
- Git para clonar el repositorio.
- No se necesita Java ni Python para ejecutar estas pruebas.
- Si una suite prueba una aplicación local, esa aplicación debe estar instalada y ejecutándose; revisa su README para conocer sus propios requisitos.

## Instalación

Clona el repositorio y entra a su carpeta:

```powershell
git clone https://github.com/Thiago909q/Automatizacion-cypress-grupo4.git
cd Automatizacion-cypress-grupo4
```

Instala las dependencias de Cypress:

```powershell
npm install
```

## Cómo ejecutar los tests

Desde la raíz del repositorio:

```powershell
npx cypress run
```

Este comando ejecuta las suites E2E en modo consola. Para abrir Cypress y seleccionar las pruebas desde la interfaz:

```powershell
npx cypress open
```

Las suites que dependen de una aplicación local requieren que el servidor esté iniciado antes de ejecutar Cypress. La URL base y los comandos para levantar la aplicación pueden variar según la rama y están indicados en el README correspondiente.

## Organización por ramas

Cada integrante puede desarrollar y documentar sus pruebas en su propia rama. El README de esa rama debe identificar los autores y POMs incluidos, describir los casos cubiertos y detallar cualquier requisito adicional de la aplicación bajo prueba.

En `main` se mantiene la configuración general del repositorio. Consultar el README de la rama de trabajo para conocer el alcance específico de sus pruebas.
