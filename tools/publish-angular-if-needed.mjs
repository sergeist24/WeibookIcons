#!/usr/bin/env node
/**
 * Publica `@weibook/icons-angular` desde `dist/weibook-icons-angular/` cuando esa versión
 * aún no existe en npm (útil después de `changeset publish` para core/react).
 * Sube la versión manualmente en `projects/icons-angular/package.json` cuando corresponda publicar Angular.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePkgPath = join(root, 'projects/icons-angular/package.json');
const distDir = join(root, 'dist/weibook-icons-angular');
const distPkgPath = join(distDir, 'package.json');

const sourcePkg = JSON.parse(readFileSync(sourcePkgPath, 'utf8'));
const pkgName = sourcePkg.name;
const version = sourcePkg.version;

if (!existsSync(distPkgPath)) {
  console.error('[publish-angular-if-needed] Falta dist/weibook-icons-angular. Ejecuta `npm run build:angular`.');
  process.exit(1);
}

let alreadyPublished = false;
try {
  const out = execSync(`npm view ${pkgName}@${version} version`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();

  alreadyPublished = out === version;
} catch {
  alreadyPublished = false;
}

if (alreadyPublished) {
  console.log(`[publish-angular-if-needed] ${pkgName}@${version} ya existe en npm. No se publica.`);
  process.exit(0);
}

console.log(`[publish-angular-if-needed] Publicando ${pkgName}@${version} desde dist/weibook-icons-angular ...`);
execSync('npm publish --access public', { cwd: distDir, stdio: 'inherit', env: process.env });
