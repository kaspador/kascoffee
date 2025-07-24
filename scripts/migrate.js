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
    
    // Read and execute the nuclear fix migration
    const nuclearFixSQL = readFileSync(join(__dirname, 'nuclear-fix.sql'), 'utf8');
    
    console.log('Running nuclear fix migration - recreating Better Auth tables...');
    await sql.unsafe(nuclearFixSQL);
    console.log('✓ Nuclear fix migration completed - Better Auth tables recreated');
    
    console.log('All migrations completed successfully!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration(); 