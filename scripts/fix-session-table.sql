-- Fix session table for Better Auth compatibility
DO $$ 
BEGIN
  -- First, clean up any broken session records
  BEGIN
    DELETE FROM session WHERE token IS NULL OR token = '';
    RAISE NOTICE 'Cleaned up invalid session records';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not clean session records: %', SQLERRM;
  END;

  -- Ensure the session table has proper structure
  BEGIN
    -- Make sure token column exists and has proper constraints
    ALTER TABLE session ALTER COLUMN token SET NOT NULL;
    
    -- Ensure unique constraint exists
    ALTER TABLE session ADD CONSTRAINT session_token_unique UNIQUE (token);
  EXCEPTION 
    WHEN duplicate_table THEN 
      RAISE NOTICE 'Constraint already exists';
    WHEN others THEN 
      RAISE NOTICE 'Could not modify session table: %', SQLERRM;
  END;

  -- Ensure defaults are set
  BEGIN
    ALTER TABLE session ALTER COLUMN created_at SET DEFAULT NOW();
    ALTER TABLE session ALTER COLUMN updated_at SET DEFAULT NOW();
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not set session defaults: %', SQLERRM;
  END;

  -- Clean up any orphaned sessions
  BEGIN
    DELETE FROM session WHERE user_id NOT IN (SELECT id FROM "user");
    RAISE NOTICE 'Cleaned up orphaned sessions';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not clean orphaned sessions: %', SQLERRM;
  END;
  
END $$; 