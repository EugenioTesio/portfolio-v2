import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = 'flutter-a2ui-playground';
const project = path.join(root, 'examples', name);
function run(command, args, cwd = project) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error || result.status !== 0) throw result.error ?? new Error(`${command} failed (${result.status})`);
}
run(process.env.FLUTTER_BIN || 'flutter', ['pub', 'get', '--enforce-lockfile']);
run(process.env.FLUTTER_BIN || 'flutter', ['build', 'web', '--release', '--base-href', `/demos/${name}/`, '--pwa-strategy=none']);
const target = path.join(root, 'public/demos', name);
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(path.join(project, 'build/web'), target, { recursive: true });
// This application deliberately has no offline service worker.
fs.rmSync(path.join(target, 'flutter_service_worker.js'), { force: true });
const zip = path.join(root, 'public/downloads', `${name}.zip`);
fs.mkdirSync(path.dirname(zip), { recursive: true });
fs.rmSync(zip, { force: true });
run('zip', ['-qr', zip, 'lib', 'test', 'tool', 'web', 'pubspec.yaml', 'pubspec.lock', 'analysis_options.yaml', 'README.md', 'LICENSE', '-x', '*.DS_Store']);
console.log(`Prepared demo and source ZIP: ${name}`);
