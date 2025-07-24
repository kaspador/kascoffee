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
    
    // Read and execute the SQL migrations
    const expiresAtSQL = readFileSync(join(__dirname, 'add-expires-at.sql'), 'utf8');
    const accountDefaultsSQL = readFileSync(join(__dirname, 'add-defaults.sql'), 'utf8');
    const sessionDefaultsSQL = readFileSync(join(__dirname, 'add-session-defaults.sql'), 'utf8');
    
    console.log('Running migration to add expires_at column...');
    await sql.unsafe(expiresAtSQL);
    console.log('✓ expires_at column migration completed');
    
    console.log('Running migration to add account table defaults...');
    await sql.unsafe(accountDefaultsSQL);
    console.log('✓ Account defaults migration completed');
    
    console.log('Running migration to add session table defaults...');
    await sql.unsafe(sessionDefaultsSQL);
    console.log('✓ Session defaults migration completed');
    
    console.log('All migrations completed successfully!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration(); 