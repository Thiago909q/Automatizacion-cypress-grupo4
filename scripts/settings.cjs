const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const root = path.resolve(__dirname, '..');
const appPath = path.resolve(root, process.env.APP_PATH || '../grupo4');
const port = Number(process.env.E2E_PORT || 8877);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('E2E_PORT debe ser un puerto entre 1024 y 65535.');
}
const baseUrl = `http://127.0.0.1:${port}`;
const databasePath = path.join(root, '.runtime', 'pom-e2e.sqlite');
const phpBinary = process.env.PHP_BINARY || 'php';
const composerBinary = process.env.COMPOSER_BINARY || 'composer';

function appEnvironment() {
  fs.mkdirSync(path.join(root, '.runtime'), { recursive: true });
  const keyPath = path.join(root, '.runtime', 'app-key');
  if (!fs.existsSync(keyPath)) {
    fs.writeFileSync(keyPath, `base64:${crypto.randomBytes(32).toString('base64')}`, { mode: 0o600 });
  }
  return {
    ...process.env,
    APP_ENV: 'e2e',
    APP_DEBUG: 'false',
    APP_KEY: fs.readFileSync(keyPath, 'utf8').trim(),
    APP_URL: baseUrl,
    APP_CONFIG_CACHE: path.join(root, '.runtime', 'unused-config.php'),
    DB_CONNECTION: 'sqlite',
    DB_DATABASE: databasePath,
    DB_URL: '',
    SESSION_DRIVER: 'database',
    SESSION_COOKIE: 'prolink_pom_e2e_session',
    SESSION_DOMAIN: '',
    CACHE_STORE: 'array',
    QUEUE_CONNECTION: 'sync',
    MAIL_MAILER: 'log',
    BCRYPT_ROUNDS: '4',
    PHP_CLI_SERVER_WORKERS: '1',
  };
}

function verifyApp() {
  if (!fs.existsSync(path.join(appPath, 'artisan'))) {
    throw new Error(`No se encontró Laravel en ${appPath}. Configurá APP_PATH en .env.`);
  }
  const profile = fs.readFileSync(path.join(appPath, 'resources/js/pages/settings/profile.tsx'), 'utf8');
  if (!profile.includes('data-testid="profile-save"')) {
    throw new Error('Falta aplicar patches/prolink-pom.patch al proyecto grupo4. Ver README.');
  }
}

module.exports = { root, appPath, baseUrl, port, databasePath, phpBinary, composerBinary, appEnvironment, verifyApp };
