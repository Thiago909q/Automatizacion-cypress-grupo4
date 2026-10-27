const cypress = require('cypress');
const { startApp } = require('./app-process.cjs');
const { root } = require('./settings.cjs');

(async () => {
  let server;
  try {
    server = await startApp();
    process.on('SIGINT', () => { server.stop(); process.exit(130); });
    process.on('SIGTERM', () => { server.stop(); process.exit(143); });
    const args = process.argv.slice(2);
    const specIndex = args.indexOf('--spec');
    if (specIndex >= 0 && !args[specIndex + 1]) throw new Error('Falta la ruta después de --spec.');
    if (args.includes('--open')) await cypress.open({ project: root });
    else {
      const result = await cypress.run({ project: root, browser: 'electron', ...(specIndex >= 0 ? { spec: args[specIndex + 1] } : {}) });
      if (result.status === 'failed') throw new Error(result.message || 'Cypress no pudo iniciar.');
      process.exitCode = result.totalFailed > 0 ? 1 : 0;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally { server?.stop(); }
})();
