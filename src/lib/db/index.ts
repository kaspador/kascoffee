import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use a fallback for development when no database is configured
const databaseUrl = process.env.DATABASE_URL || 'postgresql://fallback:fallback@localhost:5432/fallback';

let client: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

try {
	client = postgres(databaseUrl);
	db = drizzle(client, { schema });
} catch {
	console.warn('Database connection failed - running in development mode with mock data');
	// Database will be null/undefined, components will use mock data
}

export { db }; 