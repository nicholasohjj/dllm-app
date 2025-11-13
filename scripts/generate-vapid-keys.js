// Script to generate VAPID keys for Web Push notifications
// Run with: node scripts/generate-vapid-keys.js

import webpush from 'web-push';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔑 Generating VAPID keys for Web Push notifications...\n');

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID keys generated successfully!\n');
console.log('📋 Your VAPID keys:\n');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
console.log('\n');

// Create .env file content
const envContent = `# VAPID Keys for Web Push Notifications
# Generated on ${new Date().toISOString()}
# DO NOT SHARE YOUR PRIVATE KEY!

# Public key (used in the frontend)
VITE_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}

# Private key (used in the backend/API)
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}

# Subject (your email or website URL)
VAPID_SUBJECT=mailto:your-email@example.com

# Lambda URL (replace with your actual Lambda URL)
VITE_REACT_APP_LAMBDA_URL=your-lambda-url-here
`;

// Create .env.example file content
const envExampleContent = `# VAPID Keys for Web Push Notifications
# Run 'npm run generate-vapid' to generate your own keys

# Public key (used in the frontend)
VITE_VAPID_PUBLIC_KEY=your-public-key-here

# Private key (used in the backend/API)
VAPID_PRIVATE_KEY=your-private-key-here

# Subject (your email or website URL)
VAPID_SUBJECT=mailto:your-email@example.com

# Lambda URL
VITE_REACT_APP_LAMBDA_URL=your-lambda-url-here
`;

// Save to .env file (only if it doesn't exist)
const envPath = join(__dirname, '..', '.env');
const envExamplePath = join(__dirname, '..', '.env.example');

try {
  if (!existsSync(envPath)) {
    writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with your VAPID keys');
  } else {
    console.log('⚠️  .env file already exists. Here\'s what to add:');
    console.log('\n' + envContent);
  }

  // Always update .env.example
  writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ Created/Updated .env.example file');
  
  console.log('\n📝 Important:');
  console.log('1. Add .env to your .gitignore file (if not already added)');
  console.log('2. Update VAPID_SUBJECT with your email or website URL');
  console.log('3. Update VITE_REACT_APP_LAMBDA_URL with your actual Lambda URL');
  console.log('4. Keep your private key secure - never commit it to version control');
  console.log('5. Add the public key to your frontend environment variables');
  console.log('\n🚀 You\'re all set! Restart your dev server to use the new keys.');
  
} catch (error) {
  console.error('❌ Error writing files:', error);
  console.log('\nManually copy the following to your .env file:');
  console.log(envContent);
}

