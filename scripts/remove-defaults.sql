-- Remove default values from timestamp columns - Better Auth will manage these
DO $$ 
BEGIN
  -- Remove default values from session table
  BEGIN
    ALTER TABLE session ALTER COLUMN created_at DROP DEFAULT;
    ALTER TABLE session ALTER COLUMN updated_at DROP DEFAULT;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not remove defaults from session table: %', SQLERRM;
  END;
  
  -- Remove default values from account table  
  BEGIN
    ALTER TABLE account ALTER COLUMN created_at DROP DEFAULT;
    ALTER TABLE account ALTER COLUMN updated_at DROP DEFAULT;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not remove defaults from account table: %', SQLERRM;
  END;
END $$; 