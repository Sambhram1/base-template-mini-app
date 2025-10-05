import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.production' }); // Override with production values

async function buildForNetlify() {
  try {
    console.log('🚀 Building for Netlify deployment...');
    
    // Check if we have the required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_URL',
      'NEXT_PUBLIC_FRAME_NAME', 
      'NEXT_PUBLIC_FRAME_BUTTON_TEXT'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Some environment variables are missing, using defaults:');
      missingVars.forEach(varName => {
        console.log(`  - ${varName}`);
      });
    }

    // Set default values for missing environment variables
    if (!process.env.NEXT_PUBLIC_URL) {
      process.env.NEXT_PUBLIC_URL = 'https://luxlink-app.netlify.app';
    }
    if (!process.env.NEXT_PUBLIC_FRAME_NAME) {
      process.env.NEXT_PUBLIC_FRAME_NAME = 'LuxLink - Luxury NFT Authenticator';
    }
    if (!process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT) {
      process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT = 'Open LuxLink';
    }
    if (!process.env.NEXT_PUBLIC_FRAME_DESCRIPTION) {
      process.env.NEXT_PUBLIC_FRAME_DESCRIPTION = 'Verify, showcase, and trade luxury products tokenized as NFTs on Base';
    }
    if (!process.env.NEXT_PUBLIC_ANALYTICS_ENABLED) {
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'false';
    }
    if (!process.env.NEXT_PUBLIC_USE_WALLET) {
      process.env.NEXT_PUBLIC_USE_WALLET = 'true';
    }

    console.log('✅ Environment variables configured');
    console.log(`📦 Building for: ${process.env.NEXT_PUBLIC_URL}`);

    // Run next build
    console.log('\n🔨 Building Next.js application...');
    const nextBin = path.normalize(path.join(projectRoot, 'node_modules', '.bin', 'next'));
    
    execSync(`"${nextBin}" build`, { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });

    console.log('\n✨ Netlify build complete! 🪐');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildForNetlify();