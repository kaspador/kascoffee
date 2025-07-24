-- Nuclear fix: Drop and recreate Better Auth tables with correct schema
DO $$ 
BEGIN
  -- Drop all Better Auth tables (preserve userPages and user foreign key data)
  BEGIN
    DROP TABLE IF EXISTS session CASCADE;
    DROP TABLE IF EXISTS account CASCADE;
    DROP TABLE IF EXISTS verification CASCADE;
    RAISE NOTICE 'Dropped existing Better Auth tables';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not drop tables: %', SQLERRM;
  END;

  -- Recreate session table exactly as Better Auth expects
  BEGIN
    CREATE TABLE session (
      id text PRIMARY KEY,
      expires_at timestamp NOT NULL,
      token text NOT NULL UNIQUE,
      created_at timestamp NOT NULL DEFAULT NOW(),
      updated_at timestamp NOT NULL DEFAULT NOW(),
      ip_address text,
      user_agent text,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    );
    RAISE NOTICE 'Created session table';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not create session table: %', SQLERRM;
  END;

  -- Recreate account table exactly as Better Auth expects
  BEGIN
    CREATE TABLE account (
      id text PRIMARY KEY,
      account_id text NOT NULL,
      provider_id text NOT NULL,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      access_token text,
      refresh_token text,
      id_token text,
      access_token_expires_at timestamp,
      refresh_token_expires_at timestamp,
      scope text,
      password text,
      created_at timestamp NOT NULL DEFAULT NOW(),
      updated_at timestamp NOT NULL DEFAULT NOW()
    );
    RAISE NOTICE 'Created account table';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not create account table: %', SQLERRM;
  END;

  -- Recreate verification table exactly as Better Auth expects
  BEGIN
    CREATE TABLE verification (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamp NOT NULL,
      created_at timestamp DEFAULT NOW(),
      updated_at timestamp DEFAULT NOW()
    );
    RAISE NOTICE 'Created verification table';
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'Could not create verification table: %', SQLERRM;
  END;

END $$; 