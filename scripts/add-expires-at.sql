-- Add missing expires_at column to account table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'account' 
    AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE account ADD COLUMN expires_at timestamp;
  END IF;
END $$; 