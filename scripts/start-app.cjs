const { startApp } = require('./app-process.cjs');
const { baseUrl } = require('./settings.cjs');
startApp().then(({ child, stop }) => {
  console.log(`Servidor de pruebas disponible en ${baseUrl}. Ctrl+C para detenerlo.`);
  process.on('SIGINT', () => { stop(); process.exit(0); });
  process.on('SIGTERM', () => { stop(); process.exit(0); });
  child.on('exit', code => { process.exitCode = code || 0; });
}).catch(error => { console.error(error.message); process.exitCode = 1; });
