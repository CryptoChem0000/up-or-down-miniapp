// Test script to manually trigger settlement for yesterday
// This will process your vote and add it to the leaderboard

const https = require('https');

const url = 'https://up-or-down-miniapp.vercel.app/api/cron/close';

// Add authorization header (you'll need to set CRON_SECRET in Vercel env vars)
const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`,
    'User-Agent': 'Vercel-Cron/1.0'
  }
};

console.log('Triggering manual settlement...');
console.log('URL:', url);

const req = https.request(url, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ Settlement completed successfully!');
      console.log('Your vote should now appear in the leaderboard.');
    } else {
      console.log('❌ Settlement failed');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
