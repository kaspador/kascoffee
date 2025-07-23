declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Database
			DATABASE_URL: string;

			// Better Auth
			BETTER_AUTH_SECRET: string;
			BETTER_AUTH_URL: string;

			// OAuth Providers
			GITHUB_CLIENT_ID: string;
			GITHUB_CLIENT_SECRET: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			TWITTER_CLIENT_ID: string;
			TWITTER_CLIENT_SECRET: string;

			// External APIs
			RECAPTCHA_SITE_KEY: string;
			RECAPTCHA_SECRET_KEY: string;
		}
	}
}

export {}; 