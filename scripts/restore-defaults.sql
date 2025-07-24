-- Add back default values for timestamp columns - Better Auth seems to expect these
DO $$ 
BEGIN
  -- Add default values to session table
  BEGIN
    ALTER TABLE session ALTER COLUMN created_at SET DEFAULT NOW();
    ALTER TABLE session ALTER COLUMN updated_at SET DEFAULT NOW();
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not add defaults to session table: %', SQLERRM;
  END;
  
  -- Add default values to account table  
  BEGIN
    ALTER TABLE account ALTER COLUMN created_at SET DEFAULT NOW();
    ALTER TABLE account ALTER COLUMN updated_at SET DEFAULT NOW();
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not add defaults to account table: %', SQLERRM;
  END;
  
  -- Update any existing NULL values to current timestamp
  BEGIN
    UPDATE session SET created_at = NOW() WHERE created_at IS NULL;
    UPDATE session SET updated_at = NOW() WHERE updated_at IS NULL;
    UPDATE account SET created_at = NOW() WHERE created_at IS NULL;
    UPDATE account SET updated_at = NOW() WHERE updated_at IS NULL;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not update existing NULL values: %', SQLERRM;
  END;
END $$; 