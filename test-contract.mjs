import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const LUXLINK_NFT_ADDRESS = '0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7';
const LUXLINK_NFT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "verifyAuthenticity",
    "outputs": [
      {"internalType": "bool", "name": "isAuthentic", "type": "bool"},
      {"internalType": "string", "name": "productId", "type": "string"},
      {"internalType": "address", "name": "manufacturer", "type": "address"},
      {"internalType": "string", "name": "brandName", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNextTokenId", 
    "outputs": [{"internalType": "uint256", "name": "nextId", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const client = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org')
});

async function testContract() {
  console.log('Testing LuxLink NFT Contract...');
  console.log('Contract Address:', LUXLINK_NFT_ADDRESS);
  
  try {
    // Get next token ID to see how many tokens exist
    const nextTokenId = await client.readContract({
      address: LUXLINK_NFT_ADDRESS,
      abi: LUXLINK_NFT_ABI,
      functionName: 'getNextTokenId'
    });
    
    console.log('Next Token ID:', nextTokenId.toString());
    console.log('Total minted tokens:', (Number(nextTokenId) - 1));
    
    if (nextTokenId > 1) {
      // Test verification of token 1
      console.log('\nTesting verification of token 1...');
      try {
        const verification = await client.readContract({
          address: LUXLINK_NFT_ADDRESS,
          abi: LUXLINK_NFT_ABI,
          functionName: 'verifyAuthenticity',
          args: [1n]
        });
        
        console.log('Token 1 verification result:', {
          isAuthentic: verification[0],
          productId: verification[1], 
          manufacturer: verification[2],
          brandName: verification[3]
        });
        
        // Try to get token URI
        try {
          const tokenURI = await client.readContract({
            address: LUXLINK_NFT_ADDRESS,
            abi: LUXLINK_NFT_ABI,
            functionName: 'tokenURI',
            args: [1n]
          });
          console.log('Token 1 URI:', tokenURI);
          
          // If it's base64 encoded, decode it
          if (tokenURI.startsWith('data:application/json;base64,')) {
            const jsonString = atob(tokenURI.replace('data:application/json;base64,', ''));
            const metadata = JSON.parse(jsonString);
            console.log('Decoded metadata:', metadata);
          }
        } catch (uriError) {
          console.log('Could not get token URI:', uriError.message);
        }
        
      } catch (verifyError) {
        console.log('Verification failed for token 1:', verifyError.message);
      }
    } else {
      console.log('No tokens have been minted yet');
    }
    
  } catch (error) {
    console.error('Contract test failed:', error.message);
  }
}

testContract();