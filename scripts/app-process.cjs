const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { appPath, root, baseUrl, port, databasePath, phpBinary, appEnvironment, verifyApp } = require('./settings.cjs');

async function startApp() {
  verifyApp();
  for (const file of ['vendor/autoload.php', 'public/build/manifest.json']) {
    if (!fs.existsSync(path.join(appPath, file))) throw new Error('Faltan dependencias o el build. Ejecutá npm run setup:app.');
  }
  if (!fs.existsSync(databasePath)) throw new Error('Falta la base de pruebas. Ejecutá npm run setup:app.');
  if (fs.existsSync(path.join(appPath, 'public/hot'))) throw new Error('Cerrá Vite y eliminá public/hot antes de ejecutar los tests.');
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`El puerto ${port} está ocupado. Cambiá E2E_PORT o cerrá la otra ejecución.`)));
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
  const log = fs.openSync(path.join(root, '.runtime', 'server.log'), 'a');
  const child = spawn(phpBinary, ['artisan', 'serve', '--host=127.0.0.1', `--port=${port}`, '--no-reload'], {
    cwd: appPath, env: appEnvironment(), stdio: ['ignore', log, log], detached: process.platform !== 'win32',
  });
  let spawnError;
  child.on('error', error => { spawnError = error; });
  const stop = () => {
    if (child.exitCode === null && child.pid) {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      else { try { process.kill(-child.pid, 'SIGTERM'); } catch { /* Ya finalizó. */ } }
    }
  };
  try {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      if (spawnError) throw spawnError;
      if (child.exitCode !== null) throw new Error('Laravel no inició. Revisá .runtime/server.log.');
      try {
        const response = await fetch(`${baseUrl}/up`, { signal: AbortSignal.timeout(1500) });
        if (response.ok) return { child, stop };
      } catch { /* Se vuelve a consultar hasta que el servidor esté listo. */ }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    throw new Error('El servidor no respondió a tiempo. Revisá .runtime/server.log.');
  } catch (error) { stop(); throw error; }
}

module.exports = { startApp };
