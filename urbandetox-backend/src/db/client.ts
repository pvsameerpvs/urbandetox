import Database from 'better-sqlite3';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_STATEMENTS } from './schema';
import { seedDatabase } from './seed';

let dbInstance: Database.Database | null = null;

function findWorkspaceRoot(): string {
  let current = process.cwd();

  while (true) {
    const packageJsonPath = resolve(current, 'package.json');

    if (existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string };
        const looksLikeRoot = pkg.name === 'urbandetox';

        if (looksLikeRoot) {
          return current;
        }
      } catch {
        // Ignore malformed files and keep walking up.
      }
    }

    const parent = dirname(current);
    if (parent === current) {
      break;
    }

    current = parent;
  }

  const packageDir = dirname(fileURLToPath(import.meta.url));
  return resolve(packageDir, '../../..');
}

export function getWorkspaceRoot(): string {
  return findWorkspaceRoot();
}

export function getDatabasePath(): string {
  const explicitPath = process.env.URBANDETOX_DB_PATH;
  if (explicitPath) {
    return resolve(explicitPath);
  }

  return resolve(getWorkspaceRoot(), 'data', 'urbandetox.sqlite');
}

export function getUploadsRoot(): string {
  const explicitPath = process.env.URBANDETOX_UPLOADS_DIR;
  if (explicitPath) {
    return resolve(explicitPath);
  }

  return resolve(getWorkspaceRoot(), 'uploads');
}

function initialise(db: Database.Database) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  for (const statement of SCHEMA_STATEMENTS) {
    db.exec(statement);
  }

  seedDatabase(db);
}

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const databasePath = getDatabasePath();
  console.log('URBANDETOX DB CONNECTING TO:', databasePath);
  mkdirSync(dirname(databasePath), { recursive: true });

  dbInstance = new Database(databasePath);
  initialise(dbInstance);
  return dbInstance;
}

export function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
