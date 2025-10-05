# LuxLink NFT Authenticator - Deployment Guide

## Netlify Deployment

This project is configured for easy deployment on Netlify.

### Quick Deploy

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build:netlify`
   - Publish directory: `.next`
   - Node.js version: `18.20.4`

3. **Environment Variables**: Set the following in Netlify dashboard:
   ```
   NEXT_PUBLIC_URL=https://your-app-name.netlify.app
   NEXT_PUBLIC_FRAME_NAME=LuxLink - Luxury NFT Authenticator
   NEXT_PUBLIC_FRAME_DESCRIPTION=Verify, showcase, and trade luxury products tokenized as NFTs on Base
   NEXT_PUBLIC_FRAME_BUTTON_TEXT=Open LuxLink
   NEXT_PUBLIC_USE_WALLET=true
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   PRIVATE_KEY=0x90c793c2f44238afbb822345a0296f1a56a53ce1b4a1328eb6c30bab04e5c396
   ```

### Features Enabled in Production

- ✅ QR Code Scanning for NFT Verification
- ✅ Base Sepolia Network Integration
- ✅ Authorized NFT Minting (Private Key: `0x90c793c2f44238afbb822345a0296f1a56a53ce1b4a1328eb6c30bab04e5c396`)
- ✅ Manual Image Upload for Manufacturers
- ✅ Contract Integration (`0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7`)
- ✅ Simplified UI (Scan/Mint tabs only)

### Smart Contract Details

- **Contract Address**: `0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7`
- **Network**: Base Sepolia Testnet
- **Authorized Minter**: `0xeA60bCEe9526E87b6a3155d238220213c6EaE6D4`
- **Existing Tokens**: Token ID `1` and `2` are already minted for testing

### Local Development

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3001

### Build Configuration

- **Production Build**: Uses `.env.production` for environment-specific settings
- **ESLint**: Disabled during builds to prevent deployment failures
- **TypeScript**: Build errors ignored for faster deployments
- **Node Version**: 18.20.4 (specified in `.nvmrc`)