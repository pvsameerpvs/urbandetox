import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname, '..');
const dbPath = resolve(root, 'data', 'urbandetox.sqlite');
const uploadsPath = resolve(root, 'uploads');

if (existsSync(dbPath)) {
  rmSync(dbPath, { force: true });
}

if (existsSync(uploadsPath)) {
  rmSync(uploadsPath, { recursive: true, force: true });
}

console.log('UrbanDetox local database and uploads reset.');
