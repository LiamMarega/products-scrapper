// setup-vendure.js - Script para configurar Tax Zone en Vendure
// Usage: node setup-vendure.js

import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';

const ADMIN_API = process.env.ADMIN_API || 'http://localhost:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   VENDURE SETUP - Tax Zone Configuration                 ║');
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
    
    if (taxData.taxRates.items.length > 0) {
      console.log('✅ Tax rates already configured:');
      taxData.taxRates.items.forEach(rate => {
        console.log(`   - ${rate.name}: ${rate.value}% (Zone: ${rate.zone?.name || 'None'})`);
      });
      console.log();
      console.log('✅ Your Vendure instance is already configured!');
      console.log('✅ You can now run: node import-products.js');
      return;
    }

    console.log('⚠️  No tax configuration found. Setting up...\n');

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
    const zoneId = zoneResult.createZone.id;
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

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SETUP COMPLETED SUCCESSFULLY!              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n✅ Your Vendure instance is now configured with:');
    console.log('   • Country: United States');
    console.log('   • Zone: Default Zone');
    console.log('   • Tax Category: Standard');
    console.log('   • Tax Rate: 20%');
    console.log('\n🚀 You can now import products:');
    console.log('   export CSV_PATH="$(pwd)/living-room.csv"');
    console.log('   node import-products.js');

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

