// update-search-index.js - Actualizar índice de búsqueda después del import
// Útil si tienes bufferUpdates habilitado en tu SearchPlugin
// Usage: node update-search-index.js

import { GraphQLClient } from 'graphql-request';
import fetch from 'cross-fetch';

const ADMIN_API = process.env.ADMIN_API || 'http://127.0.0.1:3000/admin-api';
const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'superadmin';
const VENDURE_CHANNEL = process.env.VENDURE_CHANNEL || null;

// -------------------- Login --------------------
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
    const msg = data?.data?.login?.message || 'Login fallido';
    throw new Error(`Login fallido: ${msg}`);
  }

  const rawCookies = res.headers.raw()['set-cookie'];
  const cookie = rawCookies
    .map(c => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ');
  
  return cookie;
}

// -------------------- Reindex --------------------
async function reindexSearch(cookie) {
  const headers = VENDURE_CHANNEL
    ? { cookie, 'vendure-token': VENDURE_CHANNEL }
    : { cookie };
  
  const client = new GraphQLClient(ADMIN_API, { fetch, headers });
  
  const REINDEX = `
    mutation Reindex {
      reindex {
        id
        name
        state
        progress
        result
      }
    }
  `;
  
  console.log('→ Ejecutando reindex del índice de búsqueda...');
  const res = await client.request(REINDEX);
  
  if (res?.reindex) {
    console.log('✓ Job de reindex iniciado:');
    console.log(`  ID: ${res.reindex.id}`);
    console.log(`  Estado: ${res.reindex.state}`);
    console.log(`  Progreso: ${res.reindex.progress}%`);
    
    // Esperar a que termine
    await waitForJob(client, res.reindex.id);
  } else {
    console.warn('⚠ No se pudo iniciar el reindex');
  }
}

async function waitForJob(client, jobId) {
  const GET_JOB = `
    query GetJob($id: ID!) {
      job(jobId: $id) {
        id
        state
        progress
        result
      }
    }
  `;
  
  let attempts = 0;
  const maxAttempts = 60; // 5 minutos máximo
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // esperar 5s
    
    const res = await client.request(GET_JOB, { id: jobId });
    const job = res?.job;
    
    if (!job) {
      console.warn('⚠ No se pudo obtener estado del job');
      break;
    }
    
    console.log(`  [${job.state}] Progreso: ${job.progress}%`);
    
    if (job.state === 'COMPLETED') {
      console.log('✓ Reindex completado exitosamente');
      if (job.result) {
        console.log('  Resultado:', JSON.stringify(job.result, null, 2));
      }
      break;
    }
    
    if (job.state === 'FAILED') {
      console.error('❌ Reindex falló');
      if (job.result) {
        console.error('  Error:', JSON.stringify(job.result, null, 2));
      }
      break;
    }
    
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    console.warn('⚠ Timeout esperando el reindex. El job puede estar todavía corriendo en background.');
  }
}

// -------------------- Main --------------------
(async () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║       VENDURE SEARCH INDEX UPDATE                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  try {
    console.log('→ Conectando a Admin API:', ADMIN_API);
    const cookie = await login();
    console.log('✓ Autenticado\n');
    
    await reindexSearch(cookie);
    
    console.log('\n✅ Proceso completado');
    console.log('\nPodés verificar el índice en:');
    console.log(`   ${ADMIN_API.replace('/admin-api', '/admin')}/settings/search-index`);
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    process.exit(1);
  }
})();

