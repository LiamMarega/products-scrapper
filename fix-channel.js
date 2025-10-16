// fix-channel.js - Asignar Tax Zone al Channel por defecto
import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';

const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   FIX CHANNEL - Assign Tax Zone to Default Channel       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Login
async function login() {
  const LOGIN = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        __typename
        ... on CurrentUser { id identifier }
        ... on ErrorResult { message errorCode }
      }
    }
  `;

  const res = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      query: LOGIN,
      variables: { username: ADMIN_USER, password: ADMIN_PASS },
    }),
  });

  const data = await res.json();
  
  if (data?.data?.login?.__typename !== 'CurrentUser') {
    const msg = data?.data?.login?.message || 'Login failed';
    throw new Error(`Login failed: ${msg}`);
  }

  const rawCookies = res.headers.raw()['set-cookie'];
  const cookie = rawCookies
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
  
  return cookie;
}

async function fixChannel() {
  try {
    console.log('🔐 Logging in...');
    const cookie = await login();
    console.log('✅ Logged in successfully\n');

    const client = new GraphQLClient(ADMIN_API, {
      headers: { cookie },
      fetch: fetch
    });

    // Get all channels
    console.log('🔍 Checking channels...');
    const GET_CHANNELS = `
      query {
        channels {
          items {
            id
            code
            defaultTaxZone { id name }
            defaultShippingZone { id name }
          }
        }
      }
    `;

    const channelsData = await client.request(GET_CHANNELS);
    console.log('Channels found:', channelsData.channels.items.length);
    
    for (const channel of channelsData.channels.items) {
      console.log(`\n📺 Channel: ${channel.code} (ID: ${channel.id})`);
      console.log(`   Tax Zone: ${channel.defaultTaxZone?.name || 'NOT SET ❌'}`);
      console.log(`   Shipping Zone: ${channel.defaultShippingZone?.name || 'NOT SET ❌'}`);
    }

    // Get zones
    console.log('\n🔍 Getting available zones...');
    const GET_ZONES = `
      query {
        zones {
          items {
            id
            name
            members {
              ... on Country { id name }
            }
          }
        }
      }
    `;

    const zonesData = await client.request(GET_ZONES);
    const defaultZone = zonesData.zones.items[0];
    
    if (!defaultZone) {
      console.error('❌ No zones found! Run: node setup-vendure.js');
      process.exit(1);
    }

    console.log(`✅ Found zone: ${defaultZone.name} (ID: ${defaultZone.id})`);

    // Update default channel
    const defaultChannel = channelsData.channels.items.find(c => c.code === '__default_channel__') 
                        || channelsData.channels.items[0];

    if (!defaultChannel.defaultTaxZone) {
      console.log(`\n🔧 Assigning tax zone to channel ${defaultChannel.code}...`);
      
      const UPDATE_CHANNEL = `
        mutation UpdateChannel($input: UpdateChannelInput!) {
          updateChannel(input: $input) {
            ... on Channel {
              id
              code
              defaultTaxZone { id name }
              defaultShippingZone { id name }
            }
          }
        }
      `;

      const result = await client.request(UPDATE_CHANNEL, {
        input: {
          id: defaultChannel.id,
          defaultTaxZoneId: defaultZone.id,
          defaultShippingZoneId: defaultZone.id
        }
      });

      console.log('✅ Channel updated successfully!');
      console.log(`   Tax Zone: ${result.updateChannel.defaultTaxZone.name}`);
      console.log(`   Shipping Zone: ${result.updateChannel.defaultShippingZone.name}`);
    } else {
      console.log('\n✅ Channel already has tax zone configured!');
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ CHANNEL CONFIGURED!                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n🚀 Now you can import products with prices:');
    console.log('   node import-products.js');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    process.exit(1);
  }
}

fixChannel()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
  });

