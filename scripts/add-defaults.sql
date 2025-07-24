-- Add default values to created_at and updated_at columns in account table
DO $$ 
BEGIN
  -- Add default value for created_at if it doesn't already have one
  BEGIN
    ALTER TABLE account ALTER COLUMN created_at SET DEFAULT NOW();
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not set default for created_at: %', SQLERRM;
  END;
  
  -- Add default value for updated_at if it doesn't already have one
  BEGIN
    ALTER TABLE account ALTER COLUMN updated_at SET DEFAULT NOW();
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not set default for updated_at: %', SQLERRM;
  END;
  
  -- Update any existing NULL values to current timestamp
  BEGIN
    UPDATE account SET created_at = NOW() WHERE created_at IS NULL;
    UPDATE account SET updated_at = NOW() WHERE updated_at IS NULL;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not update existing NULL values: %', SQLERRM;
  END;
END $$; 