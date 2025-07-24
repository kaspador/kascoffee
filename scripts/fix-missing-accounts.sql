-- Fix missing credential accounts for existing users
-- This handles the case where users were created but credential accounts weren't

DO $$
DECLARE
    user_record RECORD;
    account_exists BOOLEAN;
BEGIN
    -- Loop through all users who don't have credential accounts
    FOR user_record IN 
        SELECT u.id, u.email 
        FROM "user" u 
        LEFT JOIN account a ON u.id = a.user_id AND a.provider_id = 'credential'
        WHERE a.id IS NULL
    LOOP
        -- Check if any account already exists for this user
        SELECT EXISTS(
            SELECT 1 FROM account WHERE user_id = user_record.id
        ) INTO account_exists;
        
        IF NOT account_exists THEN
            -- Create a placeholder credential account 
            -- Note: Password will be NULL, user will need to reset password
            BEGIN
                INSERT INTO account (
                    id,
                    provider_id,
                    account_id,
                    user_id,
                    password,
                    created_at,
                    updated_at
                ) VALUES (
                    gen_random_uuid()::text,
                    'credential',
                    user_record.email,
                    user_record.id,
                    NULL, -- Password is NULL, forces password reset
                    NOW(),
                    NOW()
                );
                
                RAISE NOTICE 'Created placeholder credential account for user: %', user_record.email;
            EXCEPTION
                WHEN others THEN
                    RAISE NOTICE 'Failed to create account for user %: %', user_record.email, SQLERRM;
            END;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Migration completed. Users will need to reset their passwords.';
END $$; 