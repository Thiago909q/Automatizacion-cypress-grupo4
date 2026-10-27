const fs = require('node:fs');
const path = require('node:path');
const { sync: spawnSync } = require('cross-spawn');
const { appPath, databasePath, phpBinary, composerBinary, appEnvironment, verifyApp } = require('./settings.cjs');
const { applyAppPatch } = require('./apply-app-patch.cjs');

function run(command, args, env) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: appPath, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Falló ${command}. Código: ${result.status}`);
}

try {
  applyAppPatch();
  verifyApp();
  const env = appEnvironment();
  run(phpBinary, [path.join(__dirname, 'check-php.php')], env);
  run(composerBinary, ['install', '--no-interaction', '--prefer-dist'], env);
  run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci', '--no-audit', '--no-fund'], env);
  run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], env);
  if (fs.existsSync(path.join(appPath, 'public', 'hot'))) {
    throw new Error('Existe public/hot: cerrá Vite y eliminá ese archivo antes de correr las pruebas con el build.');
  }
  if (!fs.existsSync(databasePath)) fs.closeSync(fs.openSync(databasePath, 'w'));
  run(phpBinary, ['artisan', 'migrate', '--force', '--no-interaction'], env);
  console.log('\nAplicación SQLite preparada. Ejecutá node scripts/run-tests.cjs desde el repositorio de automatización.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
