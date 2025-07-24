# 🚀 Deploy kas.coffee to Railway

This guide will help you deploy your kas.coffee donation platform to Railway with PostgreSQL database and Directus CMS.

## 📋 Prerequisites

1. [Railway Account](https://railway.app) (sign up with GitHub)
2. GitHub repository: `https://github.com/kaspador/kascoffee`

## 🗄️ Step 1: Create PostgreSQL Database

1. **Login to Railway**: Go to [railway.app](https://railway.app)
2. **Create New Project**: Click "New Project"
3. **Add PostgreSQL**:
   - Click "Add Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provision a PostgreSQL database

4. **Get Database URL**:
   - Click on your PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value

## 🚀 Step 2: Deploy Next.js App

1. **Add Next.js Service**:
   - In your Railway project, click "Add Service"
   - Select "GitHub Repo"
   - Connect your `kaspador/kascoffee` repository
   - Select the `main` branch

2. **Configure Environment Variables**:
   ```bash
   # Required Variables
   DATABASE_URL=postgresql://username:password@hostname:port/database
   BETTER_AUTH_SECRET=your-32-character-random-secret
   BETTER_AUTH_URL=https://your-app.railway.app
   NEXT_PUBLIC_APP_URL=https://your-app.railway.app
   NODE_ENV=production
   
   # Optional Social Auth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

3. **Set Domain**:
   - Go to "Settings" tab
   - Click "Generate Domain" or set custom domain
   - Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` with your domain

## 📱 Step 3: Deploy Directus CMS (Optional)

1. **Add Directus Service**:
   - Click "Add Service" → "Docker Image"
   - Use image: `directus/directus:latest`

2. **Configure Directus Variables**:
   ```bash
   KEY=your-random-key-here
   SECRET=your-secret-key-here
   DB_CLIENT=pg
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_DATABASE=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   ADMIN_EMAIL=admin@kas.coffee
   ADMIN_PASSWORD=secure-admin-password
   ```

3. **Set Directus Domain**:
   - Generate domain for Directus service
   - Update your Next.js app with `DIRECTUS_URL`

## 🔧 Step 4: Configure Authentication

### Generate Auth Secret:
```bash
# Generate a secure 32-character secret
openssl rand -base64 32
```

### Social Auth Setup (Optional):

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add your Railway domain to authorized origins

#### GitHub OAuth:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set authorization callback URL: `https://your-app.railway.app/api/auth/callback/github`

## 🔍 Step 5: Verify Deployment

1. **Check Database Connection**:
   - Visit your app URL
   - Try signing up/in
   - Check Railway logs for any database errors

2. **Test Features**:
   - ✅ User registration/login
   - ✅ Profile creation
   - ✅ Theme customization
   - ✅ Public donation pages
   - ✅ QR code generation

## 🎯 Production Optimizations

### Environment Variables Checklist:
- [ ] `DATABASE_URL` - PostgreSQL connection
- [ ] `BETTER_AUTH_SECRET` - 32-char random string
- [ ] `BETTER_AUTH_URL` - Your Railway app URL
- [ ] `NEXT_PUBLIC_APP_URL` - Your Railway app URL
- [ ] `NODE_ENV=production`

### Optional Variables:
- [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- [ ] `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
- [ ] `DIRECTUS_URL` & `DIRECTUS_TOKEN`

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify `DATABASE_URL` is correct
   - Check PostgreSQL service is running
   - Review connection string format

2. **Auth Issues**:
   - Ensure `BETTER_AUTH_SECRET` is set
   - Verify `BETTER_AUTH_URL` matches your domain
   - Check social auth credentials

3. **Build Failures**:
   - Review Railway build logs
   - Ensure all dependencies are in `package.json`
   - Check TypeScript errors

### Railway Commands:
```bash
# View logs
railway logs

# Connect to database
railway connect postgres

# Redeploy
railway up
```

## 🎉 Success!

Your kas.coffee platform should now be live! 

- **App URL**: `https://your-app.railway.app`
- **Features**: User auth, profiles, donations, themes
- **Database**: PostgreSQL with automatic backups
- **CMS**: Directus for content management (optional)

## 📞 Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Directus Docs: [docs.directus.io](https://docs.directus.io)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs) 