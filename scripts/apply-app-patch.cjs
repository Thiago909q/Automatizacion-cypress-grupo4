const fs = require('node:fs');
const path = require('node:path');
const { sync: spawnSync } = require('cross-spawn');
const { appPath, root } = require('./settings.cjs');

function applyAppPatch() {
  if (!fs.existsSync(path.join(appPath, 'artisan'))) {
    throw new Error(`No se encontró Laravel en ${appPath}. Configurá APP_PATH en .env.`);
  }
  const patch = path.join(root, 'patches/prolink-pom.patch');
  const check = spawnSync('git', ['apply', '--check', '--ignore-space-change', patch], { cwd: appPath, encoding: 'utf8' });
  if (check.error) throw check.error;
  if (check.status === 0) {
    const applied = spawnSync('git', ['apply', '--ignore-space-change', patch], { cwd: appPath, encoding: 'utf8' });
    if (applied.status !== 0) throw new Error(applied.stderr || 'No se pudo aplicar el parche.');
    console.log('Aplicados los selectores de autenticación y la corrección del formulario de perfil.');
    return;
  }
  const alreadyApplied = spawnSync('git', ['apply', '--reverse', '--check', '--ignore-space-change', patch], { cwd: appPath, encoding: 'utf8' });
  if (alreadyApplied.status === 0) {
    console.log('El parche de la aplicación ya estaba aplicado.');
    return;
  }
  throw new Error(`El parche no coincide con la versión local de ProLink. Revisá los cambios sin descartar tu trabajo.\n${check.stderr}`);
}

module.exports = { applyAppPatch };
if (require.main === module) {
  try { applyAppPatch(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
