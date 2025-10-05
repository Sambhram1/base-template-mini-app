// Contract ABI for LuxLinkNFT
export const LuxLinkNFT_ABI = [
  // Constructor
  {
    "inputs": [
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "manufacturer", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "brandName", "type": "string" }
    ],
    "name": "ManufacturerRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "manufacturer", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "productId", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "ProductMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "isAuthentic", "type": "bool" },
      { "indexed": false, "internalType": "address", "name": "verifiedBy", "type": "address" }
    ],
    "name": "ProductVerified",
    "type": "event"
  },
  
  // Read Functions
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "isManufacturer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "verifyAuthenticity",
    "outputs": [
      { "internalType": "bool", "name": "isAuthentic", "type": "bool" },
      { "internalType": "string", "name": "productId", "type": "string" },
      { "internalType": "address", "name": "manufacturer", "type": "address" },
      { "internalType": "string", "name": "brandName", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getProductDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "productId", "type": "string" },
          { "internalType": "address", "name": "manufacturer", "type": "address" },
          { "internalType": "bytes", "name": "signature", "type": "bytes" },
          { "internalType": "uint256", "name": "mintTimestamp", "type": "uint256" },
          { "internalType": "bool", "name": "isVerified", "type": "bool" }
        ],
        "internalType": "struct LuxLinkNFT.ProductInfo",
        "name": "productInfo",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "manufacturer", "type": "address" }],
    "name": "getManufacturerBrand",
    "outputs": [{ "internalType": "string", "name": "brandName", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "productId", "type": "string" }],
    "name": "checkProductExists",
    "outputs": [{ "internalType": "bool", "name": "exists", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNextTokenId",
    "outputs": [{ "internalType": "uint256", "name": "nextId", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Write Functions
  {
    "inputs": [
      { "internalType": "address", "name": "manufacturer", "type": "address" },
      { "internalType": "string", "name": "brandName", "type": "string" }
    ],
    "name": "registerManufacturer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "productId", "type": "string" },
      { "internalType": "string", "name": "metadataURI", "type": "string" },
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "name": "mintProductNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;