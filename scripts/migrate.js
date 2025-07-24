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
    const addExpiresAtSQL = readFileSync(join(__dirname, 'add-expires-at-back.sql'), 'utf8');
    const sessionTokenTriggerSQL = readFileSync(join(__dirname, 'session-token-trigger.sql'), 'utf8');
    const fixMissingAccountsSQL = readFileSync(join(__dirname, 'fix-missing-accounts.sql'), 'utf8');

    console.log('Running nuclear fix migration - recreating Better Auth tables...');
    await sql.unsafe(nuclearFixSQL);
    console.log('✓ Nuclear fix migration completed - Better Auth tables recreated');

    console.log('Adding back expires_at field...');
    await sql.unsafe(addExpiresAtSQL);
    console.log('✓ expires_at field added back');

    console.log('Adding session token auto-generation trigger...');
    await sql.unsafe(sessionTokenTriggerSQL);
    console.log('✓ Session token trigger added');

        console.log('Fixing missing credential accounts for existing users...');
    await sql.unsafe(fixMissingAccountsSQL);
    console.log('✓ Missing credential accounts fixed');

    // Fix kaspaAddress column
    const fixKaspaAddressSQL = readFileSync(join(__dirname, 'fix-kaspa-address-nullable.sql'), 'utf8');
    console.log('Making kaspaAddress column nullable...');
    await sql.unsafe(fixKaspaAddressSQL);
    console.log('✓ kaspaAddress column fixed');

    console.log('All migrations completed successfully!');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration(); 