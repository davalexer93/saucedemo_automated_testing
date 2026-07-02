# saucedemo_automated_testing

Este repositorio contiene un conjunto de pruebas automatizadas de extremo a extremo para el sitio de demostración Sauce Demo, construidas con Playwright y TypeScript.

## Prerrequisitos
- Node.js 26
- Instalar dependencias con:
  - `npm i`

## Instalación
1. Clonar el repositorio.
2. Ejecutar `npm i` para instalar las dependencias del proyecto.

## Estructura de carpetas
- `package.json` - configuración de scripts y dependencias.
- `playwright.config.ts` - configuración global de Playwright.
- `tests/` - carpeta principal de pruebas.
  - `fixture.ts` - fixture compartido que abre la aplicación y cierra sesión al finalizar.
  - `saucedemoE2E.spec.ts` - pruebas de flujo exitoso y fallo de login.
  - `saucedemoCheckoutZero.spec.ts` - prueba de checkout con total $0.
  - `page_objects/` - page objects para abstraer elementos y acciones.
    - `LoginPage.ts`
    - `PersonInfoPage.ts`
    - `VoucherPage.ts`
- `playwright-report/` - reportes HTML generados por Playwright.
- `.github/workflows/playwright.yml` - pipeline de integración continua.

## Cómo ejecutar todas las pruebas
- Comando nativo:
  - `npx playwright test`
- Comando personalizado (script en `package.json`):
  - `npm run test`

Resultado esperado:
- Playwright ejecutará el conjunto de pruebas en la carpeta `tests`.
- Se generará un reporte HTML en la carpeta `playwright-report`.
- En CI, las pruebas se ejecutan en modo headless y se reintentan una vez si fallan.

## Cómo ejecutar una prueba específica
- Por archivo:
  - `npx playwright test tests/nombre_del_archivo.ts`
- Por nombre de prueba:
  - `npx playwright test tests/nombre_del_archivo.ts -g nombre_del_test`

Ejemplos en este proyecto:
- `npx playwright test tests/saucedemoE2E.spec.ts -g "successful shop in saucedemo"`
- `npx playwright test tests/saucedemoE2E.spec.ts -g "failed login in saucedemo"`
- `npx playwright test tests/saucedemoCheckoutZero.spec.ts`

> Estas ejecuciones específicas también están disponibles en el pipeline de integración continua.

## Cómo ver el reporte HTML
- Ejecutar el servidor de reportes local con:
  - `npx playwright show-report`
- Abrir directamente en el navegador el archivo:
  - `playwright-report/index.html`
- En GitHub Actions, los artefactos de reporte se descargan desde el job que ejecutó las pruebas.

## Diseño y decisiones técnicas
### Estructura del Page Object Model (POM)
- Se utiliza la carpeta `tests/page_objects` para centralizar los localizadores y acciones de los formularios.
- `LoginPage.ts` abstrae el flujo de autenticación y verifica el inicio de sesión exitoso mediante el icono del carrito.
- `PersonInfoPage.ts` centraliza el llenado de nombre, apellido y código postal.
- `VoucherPage.ts` valida el mensaje de éxito final en el flujo de checkout.

### Estrategia de localización
- Se favorece `getByRole` de Playwright para simular mejor la interacción humana y la accesibilidad.
- Donde no es posible usar roles, se combinan localizadores CSS y atributos propios de la aplicación.

### Fixtures y aislamiento de pruebas
- `tests/fixture.ts` asegura que la página principal de Saucedemo se abra antes de las pruebas que lo requieran.
- El fixture también cierra sesión con el menú de usuario y el botón `Logout` al finalizar.
- Esto ayuda a mantener las pruebas aisladas y a evitar dependencias entre casos.

### Configuración de Playwright
En `playwright.config.ts` se configura:
- `timeout` global de 30 segundos.
- `expect.timeout` de 5 segundos.
- `fullyParallel: true` para ejecutar archivos en paralelo localmente.
- `retries: 1` solo en CI.
- `workers: 1` en CI para evitar ejecutarse en paralelo contra el mismo entorno compartido.
- Reporteador HTML y reporte de lista.
- Captura de pantallas solo en fallos: `screenshot: 'only-on-failure'`.
- `headless: true` para evitar dependencia de una granja de dispositivos en GitHub Actions.
- Proyectos para `chromium` y `firefox`.

### Aislamiento de los escenarios de prueba
- `tests/saucedemoE2E.spec.ts` contiene dos pruebas independientes:
  - Flujo exitoso: usa el fixture para abrir la página y realiza el ciclo completo de compra.
  - Flujo fallido: no usa el fixture porque no inicia sesión ni requiere cerrar sesión.
- `tests/saucedemoCheckoutZero.spec.ts` prueba un checkout con total `$0.00`, validando que es posible finalizar ese flujo en un archivo separado.

### Compensaciones
- Se priorizó estabilidad y tiempos de ejecución razonables para CI.
- El modo headless y `workers: 1` en CI reducen el paralelismo extremo a cambio de mayor consistencia en entornos compartidos.

## Integración continua
El pipeline se define en `.github/workflows/playwright.yml`.

### Condiciones de ejecución
- Se ejecuta en push a `main` o `master`.
- También se puede disparar manualmente con `workflow_dispatch`.
- Se ejecuta de forma programada los viernes a las 15:00 UTC.

### Estrategia de matriz
- Se usa un `matrix` para correr en paralelo tres comandos de prueba:
  - `npx playwright test tests/saucedemoE2E.spec.ts -g "successful shop in saucedemo"`
  - `npx playwright test tests/saucedemoE2E.spec.ts -g "failed login in saucedemo"`
  - `npx playwright test tests/saucedemoCheckoutZero.spec.ts`

### Reportes y artefactos
- Se instala Node 26 y navegadores Playwright en el runner.
- Se sube la carpeta `playwright-report/` como artefacto con `actions/upload-artifact@v7`.
- Los reportes se conservan durante 1 día.

## Autor
- David Alexander Rubio Baron
- `davalexer93@gmail.com`
- `https://github.com/davalexer93`
