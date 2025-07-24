-- Fix kaspaAddress column to be nullable and update empty values
DO $$
BEGIN
  -- First, update any empty string kaspaAddress to NULL
  BEGIN
    UPDATE user_page 
    SET kaspa_address = NULL 
    WHERE kaspa_address = '' OR kaspa_address IS NOT NULL AND LENGTH(TRIM(kaspa_address)) = 0;
    
    RAISE NOTICE 'Updated empty kaspaAddress values to NULL';
  EXCEPTION
    WHEN others THEN
      RAISE NOTICE 'Could not update kaspaAddress values: %', SQLERRM;
  END;

  -- Then, make the column nullable
  BEGIN
    ALTER TABLE user_page ALTER COLUMN kaspa_address DROP NOT NULL;
    RAISE NOTICE 'Made kaspa_address column nullable';
  EXCEPTION
    WHEN others THEN
      RAISE NOTICE 'Could not alter kaspa_address column: %', SQLERRM;
  END;

END $$; 