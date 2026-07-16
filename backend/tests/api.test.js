/**
 * Backend API Sanity Test Script
 * 
 * Verifies core auth and claims operations using native fetch.
 * Ensure the server is running on port 5000 before executing this script.
 */

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🚀 Starting ClaimVision API Sanity Tests...\n');
  
  const testEmail = `test_${Date.now()}@claimvision.com`;
  const testPassword = 'security_password_123';
  let token = '';

  try {
    // 1. Ping server status
    console.log('1. Pinging Root Server...');
    const rootRes = await fetch('http://localhost:5000/');
    if (rootRes.ok) {
      const info = await rootRes.json();
      console.log(`✅ Server Status: ${info.status} (v${info.version})`);
    } else {
      throw new Error(`Server returned status: ${rootRes.status}`);
    }

    // 2. Register a new user
    console.log('\n2. Testing User Registration...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester',
        email: testEmail,
        password: testPassword
      })
    });
    
    const regData = await regRes.json();
    if (regRes.ok && regData.success) {
      console.log('✅ User registered successfully.');
      console.log(`   User ID: ${regData._id}`);
      token = regData.token;
    } else {
      throw new Error(`Registration failed: ${regData.message}`);
    }

    // 3. Log in with the registered credentials
    console.log('\n3. Testing User Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.success) {
      console.log('✅ User authenticated successfully.');
      console.log(`   JWT Token acquired: ${loginData.token.substring(0, 15)}...`);
      token = loginData.token;
    } else {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    // 4. Access protected claims repository
    console.log('\n4. Testing Secured GET /claims endpoint...');
    const claimsRes = await fetch(`${API_URL}/claims`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const claimsData = await claimsRes.json();
    if (claimsRes.ok && claimsData.success) {
      console.log('✅ Secured claim list fetched successfully.');
      console.log(`   Claim Count: ${claimsData.count}`);
    } else {
      throw new Error(`Secured claims fetch failed: ${claimsData.message}`);
    }

    console.log('\n🎉 ALL INTEGRATION API TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('\n❌ Test Suite Failed!');
    console.error(error.message);
    console.log('\nMake sure MongoDB is running and run `node server.js` before executing this test.');
    process.exit(1);
  }
};

runTests();
