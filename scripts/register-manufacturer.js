import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const LUXLINK_NFT_ADDRESS = '0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7';
const AUTHORIZED_ADDRESS = '0xeA60bCEe9526E87b6a3155d238220213c6EaE6D4';
const BRAND_NAME = 'LuxLink Authorized';

// Contract ABI - just the functions we need
const LUXLINK_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "manufacturer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "brandName",
        "type": "string"
      }
    ],
    "name": "registerManufacturer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isManufacturer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function registerManufacturer() {
  try {
    // Set up provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment variables');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(LUXLINK_NFT_ADDRESS, LUXLINK_ABI, wallet);
    
    console.log('🔍 Checking contract details...');
    console.log('Contract Address:', LUXLINK_NFT_ADDRESS);
    console.log('Signer Address:', wallet.address);
    
    // Check who is the owner
    const owner = await contract.owner();
    console.log('Contract Owner:', owner);
    
    // Check if the authorized address is already a manufacturer
    const isAlreadyManufacturer = await contract.isManufacturer(AUTHORIZED_ADDRESS);
    console.log(`Is ${AUTHORIZED_ADDRESS} already a manufacturer?`, isAlreadyManufacturer);
    
    if (isAlreadyManufacturer) {
      console.log('✅ Address is already registered as a manufacturer!');
      return;
    }
    
    if (wallet.address.toLowerCase() !== owner.toLowerCase()) {
      console.log('❌ Error: You are not the contract owner!');
      console.log('Current signer:', wallet.address);
      console.log('Contract owner:', owner);
      return;
    }
    
    // Register the manufacturer
    console.log('📝 Registering manufacturer...');
    console.log('Address to register:', AUTHORIZED_ADDRESS);
    console.log('Brand name:', BRAND_NAME);
    
    const tx = await contract.registerManufacturer(AUTHORIZED_ADDRESS, BRAND_NAME);
    console.log('Transaction hash:', tx.hash);
    
    console.log('⏳ Waiting for confirmation...');
    const receipt = await tx.wait();
    
    console.log('✅ Manufacturer registered successfully!');
    console.log('Block number:', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    // Verify registration
    const isNowManufacturer = await contract.isManufacturer(AUTHORIZED_ADDRESS);
    console.log('✅ Verification - Is now manufacturer:', isNowManufacturer);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
  }
}

registerManufacturer();