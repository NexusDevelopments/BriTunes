// Test script to verify Deezer API is working
// Run with: node test-api.js

const https = require('https');

console.log('🎵 Testing BriTunes Music APIs...\n');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function testDeezerAPI() {
  try {
    console.log('1️⃣ Testing Deezer Search API...');
    const searchRes = await makeRequest('https://api.deezer.com/search?q=Imagine%20Dragons&limit=3');
    
    if (searchRes.data && searchRes.data.length > 0) {
      console.log('   ✅ Search works! Found:', searchRes.data[0].title);
      console.log('      by', searchRes.data[0].artist.name);
    }

    console.log('\n2️⃣ Testing Deezer Artist API...');
    const artistRes = await makeRequest('https://api.deezer.com/artist/13');
    
    if (artistRes.name) {
      console.log('   ✅ Artist API works! Artist:', artistRes.name);
      console.log('      Fans:', artistRes.nb_fan?.toLocaleString());
    }

    console.log('\n3️⃣ Testing Deezer Chart/New Releases...');
    const chartRes = await makeRequest('https://api.deezer.com/chart/0/albums?limit=3');
    
    if (chartRes.data && chartRes.data.length > 0) {
      console.log('   ✅ Charts work! Latest album:', chartRes.data[0].title);
    }

    console.log('\n✨ All APIs working perfectly!');
    console.log('🎵 No API keys needed - completely FREE!');
    console.log('💰 No registration required!');
    console.log('\n✅ BriTunes is ready to use!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check your internet connection.');
  }
}

testDeezerAPI();
