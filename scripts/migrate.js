const { readFileSync } = require('fs');
const { join } = require('path');

async function runMigration() {
  try {
    // Import postgres after loading environment
    const postgres = require('postgres');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = postgres(process.env.DATABASE_URL);
    
    // Read and execute the SQL migration
    const migrationSQL = readFileSync(join(__dirname, 'add-expires-at.sql'), 'utf8');
    console.log('Running migration to add expires_at column...');
    
    await sql.unsafe(migrationSQL);
    console.log('Migration completed successfully!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration(); 