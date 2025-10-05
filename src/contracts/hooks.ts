import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, encodePacked, toHex } from 'viem';
import { LuxLinkNFT_ABI } from './abi';

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Base Sepolia Testnet
  baseSepolia: '0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7', // Deployed contract address
  // Base Mainnet  
  base: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
  // Local development
  localhost: '0x0000000000000000000000000000000000000000' // Will be updated after deployment
} as const;

// Get contract address for current network
export function getContractAddress(chainId: number): `0x${string}` {
  switch (chainId) {
    case 84532: // Base Sepolia
      return CONTRACT_ADDRESSES.baseSepolia as `0x${string}`;
    case 8453: // Base Mainnet
      return CONTRACT_ADDRESSES.base as `0x${string}`;
    case 1337: // Localhost
      return CONTRACT_ADDRESSES.localhost as `0x${string}`;
    default:
      throw new Error(`Unsupported network: ${chainId}`);
  }
}

// Hook to verify NFT authenticity
export function useVerifyNFT(tokenId: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'verifyAuthenticity',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

// Hook to get product details
export function useProductDetails(tokenId: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'getProductDetails',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

// Hook to check if user is a manufacturer
export function useIsManufacturer(address: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'isManufacturer',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook to mint NFT (for manufacturers)
export function useMintNFT(chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  const { 
    data: hash, 
    isPending, 
    writeContract, 
    error 
  } = useWriteContract();

  const { 
    isLoading: isTransactionLoading, 
    isSuccess: isTransactionSuccess 
  } = useWaitForTransactionReceipt({
    hash,
  });

  const mintNFT = (args: {
    to: `0x${string}`;
    productId: string;
    metadataURI: string;
    signature: `0x${string}`;
  }) => {
    writeContract({
      address: contractAddress,
      abi: LuxLinkNFT_ABI,
      functionName: 'mintProductNFT',
      args: [args.to, args.productId, args.metadataURI, args.signature],
    });
  };

  return {
    mintNFT,
    hash,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isTransactionSuccess,
    error,
  };
}

// Hook to get NFT owner
export function useNFTOwner(tokenId: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'ownerOf',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

// Hook to get NFT metadata URI
export function useTokenURI(tokenId: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'tokenURI',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });
}

// Hook to check if product exists
export function useProductExists(productId: string | undefined, chainId: number) {
  const contractAddress = getContractAddress(chainId);
  
  return useReadContract({
    address: contractAddress,
    abi: LuxLinkNFT_ABI,
    functionName: 'checkProductExists',
    args: productId ? [productId] : undefined,
    query: {
      enabled: !!productId,
    },
  });
}

// Utility function to create message hash for signing
export function createMessageHash(
  productId: string,
  metadataURI: string,
  manufacturerAddress: `0x${string}`
): `0x${string}` {
  return keccak256(encodePacked(
    ['string', 'string', 'address'],
    [productId, metadataURI, manufacturerAddress]
  ));
}

// Types for contract interactions
export interface ProductInfo {
  productId: string;
  manufacturer: string;
  signature: string;
  mintTimestamp: bigint;
  isVerified: boolean;
}

export interface VerificationResult {
  isAuthentic: boolean;
  productId: string;
  manufacturer: string;
  brandName: string;
}

// Contract event types
export interface ProductMintedEvent {
  manufacturer: string;
  tokenId: bigint;
  productId: string;
  to: string;
}

export interface ProductVerifiedEvent {
  tokenId: bigint;
  isAuthentic: boolean;
  verifiedBy: string;
}