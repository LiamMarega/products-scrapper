// setup-vendure.js - Script para configurar Tax Zone en Vendure
// Usage: node setup-vendure.js

import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';
import fetch from 'cross-fetch';

dotenv.config();


const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';

// Verificación de variables de entorno
console.log('🔍 Verificando variables de entorno:');
console.log('   ADMIN_API:', process.env.ADMIN_API ? '✅ Configurado' : '❌ No configurado');
console.log('   ADMIN_USER:', process.env.ADMIN_USER ? '✅ Configurado' : '❌ No configurado');
console.log('   ADMIN_PASS:', process.env.ADMIN_PASS ? '✅ Configurado' : '❌ No configurado');
console.log();

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   VENDURE SETUP - Complete Configuration                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('→ Vendure API:', ADMIN_API);
console.log();

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

async function setup() {
  try {
    // Login
    console.log('🔐 Logging in...');
    const cookie = await login();
    console.log('✅ Logged in successfully\n');

    const client = new GraphQLClient(ADMIN_API, {
      headers: { cookie },
      fetch: fetch
    });

    // Check if zone already exists
    console.log('🔍 Checking existing configuration...');
    
    const CHECK_ZONES = `
      query {
        zones {
          items {
            id
            name
            members {
              ... on Country { id code name }
            }
          }
        }
      }
    `;

    const zonesData = await client.request(CHECK_ZONES);
    
    if (zonesData.zones.items.length > 0) {
      console.log('✅ Zones already configured:');
      zonesData.zones.items.forEach(zone => {
        console.log(`   - ${zone.name} (${zone.members.length} countries)`);
      });
      console.log();
    }

    // Check tax rates
    const CHECK_TAX = `
      query {
        taxRates {
          items {
            id
            name
            value
            zone { name }
          }
        }
      }
    `;

    const taxData = await client.request(CHECK_TAX);
    
    let zoneId;
    let needsSetup = false;
    
    if (taxData.taxRates.items.length > 0) {
      console.log('✅ Tax rates already configured:');
      taxData.taxRates.items.forEach(rate => {
        console.log(`   - ${rate.name}: ${rate.value}% (Zone: ${rate.zone?.name || 'None'})`);
      });
      console.log();
      // Get the zone ID from existing zones
      zoneId = zonesData.zones.items[0]?.id;
    } else {
      needsSetup = true;
      console.log('⚠️  No tax configuration found. Setting up...\n');
    }

    if (needsSetup) {
      // Create country
      console.log('1️⃣  Creating country (United States)...');
      const CREATE_COUNTRY = `
        mutation {
          createCountry(input: {
            code: "US"
            translations: [{ languageCode: en, name: "United States" }]
            enabled: true
          }) {
            id
            code
            name
          }
        }
      `;

      let countryResult = await client.request(CREATE_COUNTRY);
      const countryId = countryResult.createCountry.id;
      console.log(`✅ Country created (ID: ${countryId})`);

      // Create zone
      console.log('2️⃣  Creating zone (Default Zone)...');
      const CREATE_ZONE = `
        mutation CreateZone($memberIds: [ID!]!) {
          createZone(input: {
            name: "Default Zone"
            memberIds: $memberIds
          }) {
            id
            name
          }
        }
      `;

      const zoneResult = await client.request(CREATE_ZONE, { memberIds: [countryId] });
      zoneId = zoneResult.createZone.id;
      console.log(`✅ Zone created (ID: ${zoneId})`);

      // Create tax category
      console.log('3️⃣  Creating tax category (Standard)...');
      const CREATE_TAX_CATEGORY = `
        mutation {
          createTaxCategory(input: {
            name: "Standard"
          }) {
            id
            name
          }
        }
      `;

      const taxCatResult = await client.request(CREATE_TAX_CATEGORY);
      const taxCategoryId = taxCatResult.createTaxCategory.id;
      console.log(`✅ Tax category created (ID: ${taxCategoryId})`);

      // Create tax rate
      console.log('4️⃣  Creating tax rate (20%)...');
      const CREATE_TAX_RATE = `
        mutation CreateTaxRate($categoryId: ID!, $zoneId: ID!) {
          createTaxRate(input: {
            name: "Standard Tax"
            enabled: true
            value: 20
            categoryId: $categoryId
            zoneId: $zoneId
          }) {
            id
            name
            value
          }
        }
      `;

      await client.request(CREATE_TAX_RATE, {
        categoryId: taxCategoryId,
        zoneId: zoneId
      });
      console.log('✅ Tax rate created (20%)');
    }

    // Step 5: Configure channel (assign tax zone to default channel)
    console.log('\n5️⃣  Configuring default channel...');
    
    // Get all channels
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
    const defaultChannel = channelsData.channels.items.find(c => c.code === '__default_channel__') 
                        || channelsData.channels.items[0];

    if (!defaultChannel) {
      console.warn('⚠️  No channels found, skipping channel configuration');
    } else {
      console.log(`📺 Found channel: ${defaultChannel.code}`);
      
      if (!defaultChannel.defaultTaxZone) {
        console.log(`   Assigning tax zone to channel...`);
        
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
            defaultTaxZoneId: zoneId,
            defaultShippingZoneId: zoneId
          }
        });

        console.log('✅ Channel configured successfully!');
        console.log(`   Tax Zone: ${result.updateChannel.defaultTaxZone.name}`);
        console.log(`   Shipping Zone: ${result.updateChannel.defaultShippingZone.name}`);
      } else {
        console.log('✅ Channel already has tax zone configured');
        console.log(`   Tax Zone: ${defaultChannel.defaultTaxZone.name}`);
        console.log(`   Shipping Zone: ${defaultChannel.defaultShippingZone?.name || 'Not set'}`);
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SETUP COMPLETED SUCCESSFULLY!              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n✅ Your Vendure instance is now configured with:');
    console.log('   • Country: United States');
    console.log('   • Zone: Default Zone');
    console.log('   • Tax Category: Standard');
    console.log('   • Tax Rate: 20%');
    console.log('   • Channel: Tax Zone assigned');
    console.log('\n🚀 You can now import products:');
    console.log('   export CSV_PATH="output/living-room.csv"');
    console.log('   node scripts/import-products.js');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    process.exit(1);
  }
}

setup()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
  });

