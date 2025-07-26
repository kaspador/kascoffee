const { createDirectus, rest, authentication, readItems } = require('@directus/sdk');

// Load environment variables
require('dotenv').config({ path: '.env' });

async function testAdminToken() {
    console.log('🧪 Testing Admin Token...\n');
    
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const adminToken = process.env.DIRECTUS_TOKEN;
    
    console.log('Directus URL:', directusUrl);
    console.log('Admin Token:', adminToken ? 'SET (hidden)' : 'NOT SET');
    
    if (!directusUrl || !adminToken) {
        console.error('❌ Missing environment variables');
        return;
    }

    const directus = createDirectus(directusUrl)
        .with(rest())
        .with(authentication());

    try {
        // Set admin token
        directus.setToken(adminToken);
        console.log('✅ Admin token set');

        // Try to read user_pages
        console.log('📖 Testing user_pages access...');
        const userPages = await directus.request(readItems('user_pages', { limit: 1 }));
        console.log('✅ user_pages accessible, found', userPages.length, 'records');

        // Try to read wallet_snapshots  
        console.log('📖 Testing wallet_snapshots access...');
        const snapshots = await directus.request(readItems('wallet_snapshots', { limit: 1 }));
        console.log('✅ wallet_snapshots accessible, found', snapshots.length, 'records');

        console.log('\n🎉 Admin token works correctly!');
        
    } catch (error) {
        console.error('\n❌ Admin token test failed:');
        console.error('Error:', error.message);
        
        if (error.response?.status === 401) {
            console.error('\n🔧 Solution: Your admin token is invalid/expired');
            console.error('1. Go to Directus Settings → Access Control → Tokens');
            console.error('2. Delete old tokens and create a new one');
            console.error('3. Update DIRECTUS_TOKEN in your production environment');
        }
    }
}

testAdminToken().catch(console.error); 