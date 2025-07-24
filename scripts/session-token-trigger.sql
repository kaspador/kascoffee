-- Add trigger to auto-generate session tokens as fallback
DO $$ 
BEGIN
  -- Create a function to generate session tokens
  CREATE OR REPLACE FUNCTION generate_session_token()
  RETURNS TRIGGER AS $func$
  BEGIN
    -- If token is NULL, generate a random token
    IF NEW.token IS NULL OR NEW.token = '' THEN
      NEW.token := 'session_' || encode(gen_random_bytes(32), 'base64');
      NEW.token := replace(NEW.token, '/', '_');
      NEW.token := replace(NEW.token, '+', '-');
      NEW.token := replace(NEW.token, '=', '');
    END IF;
    
    -- Also ensure timestamps are set if null
    IF NEW.created_at IS NULL THEN
      NEW.created_at := NOW();
    END IF;
    
    IF NEW.updated_at IS NULL THEN
      NEW.updated_at := NOW();
    END IF;
    
    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql;

  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS session_token_trigger ON session;
  
  -- Create trigger to auto-generate tokens
  CREATE TRIGGER session_token_trigger
    BEFORE INSERT OR UPDATE ON session
    FOR EACH ROW
    EXECUTE FUNCTION generate_session_token();
    
  RAISE NOTICE 'Session token auto-generation trigger created';
  
EXCEPTION 
  WHEN others THEN 
    RAISE NOTICE 'Could not create session token trigger: %', SQLERRM;
END $$; 