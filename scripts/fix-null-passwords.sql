-- Fix accounts with NULL passwords by removing them
-- This allows users to sign up again with proper password hashing

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete credential accounts where password is NULL
    -- This forces users to sign up again, creating proper accounts
    DELETE FROM account 
    WHERE provider_id = 'credential' 
    AND password IS NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Deleted % credential accounts with NULL passwords', deleted_count;
    RAISE NOTICE 'Affected users will need to sign up again to create proper accounts';
    
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not fix NULL password accounts: %', SQLERRM;
END $$; 