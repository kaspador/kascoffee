-- Add back the expires_at field that Better Auth expects for social providers
DO $$ 
BEGIN
  -- Add expires_at column to account table if it doesn't exist
  BEGIN
    ALTER TABLE account ADD COLUMN expires_at timestamp;
    RAISE NOTICE 'Added expires_at column to account table';
  EXCEPTION 
    WHEN duplicate_column THEN 
      RAISE NOTICE 'expires_at column already exists';
    WHEN others THEN 
      RAISE NOTICE 'Could not add expires_at column: %', SQLERRM;
  END;
END $$; 