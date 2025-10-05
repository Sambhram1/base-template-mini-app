export const APP_URL = process.env.NEXT_PUBLIC_URL!;
export const APP_NAME = process.env.NEXT_PUBLIC_FRAME_NAME || "LuxLink";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "Luxury NFT Authenticator & Social Feed";
export const APP_PRIMARY_CATEGORY = process.env.NEXT_PUBLIC_FRAME_PRIMARY_CATEGORY;
export const APP_TAGS = process.env.NEXT_PUBLIC_FRAME_TAGS?.split(',');
export const APP_ICON_URL = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL = `${APP_URL}/api/opengraph-image`;
export const APP_SPLASH_URL = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR = "#0a0a0a";
export const APP_BUTTON_TEXT = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT;
export const APP_WEBHOOK_URL = process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID 
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;
export const USE_WALLET = process.env.NEXT_PUBLIC_USE_WALLET === 'true';

// LuxLink specific constants
export const LUXURY_BRANDS = [
  'Gucci', 'Louis Vuitton', 'Chanel', 'Hermès', 'Rolex', 'Cartier', 'Prada', 'Dior'
];

export const NFT_VERIFICATION_STATUS = {
  VERIFIED: 'VERIFIED',
  UNVERIFIED: 'UNVERIFIED', 
  PENDING: 'PENDING',
  ERROR: 'ERROR'
} as const;

// Contract addresses
export const LUXLINK_NFT_CONTRACT_ADDRESS = '0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7';

// Authorized minter address (derived from private key)
export const AUTHORIZED_MINTER_ADDRESS = '0xeA60bCEe9526E87b6a3155d238220213c6EaE6D4';
