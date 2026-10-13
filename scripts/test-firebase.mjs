import fs from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
}

const privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

console.log('--- FIREBASE LIVE AUDIT TEST ---');
console.log('Target Project ID:', env.FIREBASE_ADMIN_PROJECT_ID);
console.log('Client Email:', env.FIREBASE_ADMIN_CLIENT_EMAIL);
console.log('Private Key Loaded:', !!privateKey);

try {
  const app = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  const db = getFirestore(app);
  console.log('Querying Firestore collections directly...');
  const cols = await db.listCollections();
  console.log('>> LIVE FIRESTORE CONNECTED SUCCESSFULLY! <<');
  console.log('Collections count:', cols.length);
  console.log('Found Collections:', cols.map(c => c.id).join(', ') || '(none yet)');

  for (const col of cols) {
    const snap = await col.limit(5).get();
    console.log(`\nCollection [${col.id}] has ${snap.size} sample docs:`);
    snap.forEach(doc => {
      console.log(`  - Doc ID: ${doc.id} =>`, JSON.stringify(doc.data()));
    });
  }

  // Test creating a new audit test document in 'enquiries' collection
  console.log('\n--- TESTING NEW DATA WRITE ---');
  const testDocRef = await db.collection('enquiries').add({
    clientName: 'Audit Test User',
    phone: '9876543210',
    email: 'audit.test@veldexfabrications.com',
    serviceRequested: 'gate-automation',
    message: 'Automated live production audit test enquiry.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
    isAuditRecord: true,
  });
  console.log('>> Successfully created test document in "enquiries"! ID:', testDocRef.id);

  // Test reading back the created document
  const readBackSnap = await testDocRef.get();
  console.log('>> Successfully read back document! Exists:', readBackSnap.exists);
  console.log('Document data:', readBackSnap.data());

  // Clean up the audit test record
  await testDocRef.delete();
  console.log('>> Cleaned up test document. Verified Write + Read + Delete lifecycle!');

} catch (err) {
  console.error('Firebase test error:', err);
}
