"use client";

import { useState, useCallback, useEffect } from "react";
import { useChainId } from "wagmi";
import { Button } from "~/components/ui/Button";
import { NFTMetadata } from "~/types/luxlink";
import { NFT_VERIFICATION_STATUS } from "~/lib/constants";
import { useVerifyNFT, useProductDetails, useTokenURI, LUXLINK_NFT_ADDRESS } from "~/contracts/LuxLinkNFT";
import { NFTQRCode } from "~/components/NFTQRCode";
import { CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";

interface NFTVerifierProps {
  onNFTVerified?: (nft: NFTMetadata) => void;
}

export function NFTVerifier({ onNFTVerified }: NFTVerifierProps) {
  const [tokenId, setTokenId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: string;
    nft?: NFTMetadata;
    error?: string;
  } | null>(null);
  const [showQR, setShowQR] = useState(false);

  const chainId = useChainId();
  
  // Contract hooks for verification
  const { 
    data: verificationData, 
    isLoading: isVerificationLoading,
    error: verificationError 
  } = useVerifyNFT(tokenId, chainId);
  
  const { 
    data: productDetails,
    isLoading: isProductLoading 
  } = useProductDetails(tokenId, chainId);
  
  const { 
    data: tokenURI,
    isLoading: isURILoading 
  } = useTokenURI(tokenId, chainId);

  const verifyNFT = useCallback(async () => {
    if (!tokenId || !tokenId.trim()) {
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      console.log("Starting verification for token ID:", tokenId);
      console.log("Chain ID:", chainId);
      console.log("Verification data:", verificationData);
      console.log("Verification error:", verificationError);
      
      // Check if there's an error first
      if (verificationError) {
        console.error("Contract verification error:", verificationError);
        let errorMessage = "Token not found or contract error";
        
        // Parse specific error messages
        if (verificationError.message?.includes("ERC721NonexistentToken")) {
          errorMessage = `Token ID ${tokenId} does not exist on this contract`;
        } else if (verificationError.message?.includes("execution reverted")) {
          errorMessage = "Contract call failed - token may not exist";
        } else if (verificationError.message?.includes("network")) {
          errorMessage = "Network error - please check your connection to Base Sepolia";
        }
        
        setVerificationResult({
          status: NFT_VERIFICATION_STATUS.ERROR,
          error: errorMessage
        });
        return;
      }
      
      // Check if we have verification data
      if (verificationData && Array.isArray(verificationData) && verificationData.length >= 4) {
        const [isAuthentic, productId, manufacturer, brandName] = verificationData;
        
        console.log("Parsed verification data:", {
          isAuthentic,
          productId, 
          manufacturer,
          brandName
        });
        
        if (isAuthentic) {
          // Try to get metadata URI, fallback to basic info if not available
          let imageUrl = `https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center`;
          
          // Try to decode tokenURI if it's base64 encoded
          if (tokenURI) {
            try {
              console.log("Token URI:", tokenURI);
              if (tokenURI.startsWith('data:application/json;base64,')) {
                const jsonString = atob(tokenURI.replace('data:application/json;base64,', ''));
                const metadata = JSON.parse(jsonString);
                console.log("Decoded metadata:", metadata);
                imageUrl = metadata.image || imageUrl;
              } else if (tokenURI.startsWith('http')) {
                imageUrl = tokenURI;
              }
            } catch (e) {
              console.log('Could not decode tokenURI, using fallback image:', e);
            }
          }

          const nftMetadata: NFTMetadata = {
            id: `${LUXLINK_NFT_ADDRESS}-${tokenId}`,
            name: `${brandName} Product #${productId}`,
            description: `Verified luxury NFT representing authentic ${brandName} product`,
            image: imageUrl,
            contractAddress: LUXLINK_NFT_ADDRESS,
            tokenId,
            brand: brandName,
            category: 'Luxury Item',
            attributes: [
              { trait_type: "Authenticity", value: "Verified" },
              { trait_type: "Manufacturer", value: manufacturer },
              { trait_type: "Product ID", value: productId },
              { trait_type: "Verified On-Chain", value: "True" }
            ]
          };

          setVerificationResult({
            status: NFT_VERIFICATION_STATUS.VERIFIED,
            nft: nftMetadata
          });

          onNFTVerified?.(nftMetadata);
        } else {
          setVerificationResult({
            status: NFT_VERIFICATION_STATUS.UNVERIFIED,
            error: `NFT verification failed. Product ID: ${productId}, Manufacturer: ${manufacturer?.slice(0,10)}...`
          });
        }
      } else {
        console.log("Waiting for verification data...");
        setVerificationResult({
          status: NFT_VERIFICATION_STATUS.PENDING,
          error: "Fetching verification data from blockchain..."
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        status: NFT_VERIFICATION_STATUS.ERROR,
        error: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsVerifying(false);
    }
  }, [tokenId, verificationData, tokenURI, verificationError, onNFTVerified, chainId]);

  // Auto-verify when data changes
  useEffect(() => {
    if (tokenId && tokenId.trim() && !isVerifying) {
      // Only trigger verification if we have some result (success or error)
      if (verificationData !== undefined || verificationError !== undefined) {
        verifyNFT();
      }
    }
  }, [tokenId, verificationData, verificationError, isVerifying, verifyNFT]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case NFT_VERIFICATION_STATUS.VERIFIED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NFT_VERIFICATION_STATUS.UNVERIFIED:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case NFT_VERIFICATION_STATUS.PENDING:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case NFT_VERIFICATION_STATUS.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case NFT_VERIFICATION_STATUS.VERIFIED:
        return "text-green-500";
      case NFT_VERIFICATION_STATUS.UNVERIFIED:
        return "text-red-500";
      case NFT_VERIFICATION_STATUS.PENDING:
        return "text-yellow-500";
      case NFT_VERIFICATION_STATUS.ERROR:
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-500 mb-2">🔍 Verify Luxury NFT</h2>
        <p className="text-gray-400 text-sm">
          Enter contract address and token ID to verify authenticity
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token ID
          </label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter NFT Token ID (e.g., 1, 2, 3...)"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            🔗 Connected to LuxLink NFT Contract on Base
          </p>
        </div>

        <Button
          onClick={verifyNFT}
          disabled={!tokenId || isVerifying || isVerificationLoading || isProductLoading || isURILoading}
          isLoading={isVerifying || isVerificationLoading || isProductLoading || isURILoading}
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-xl transition-all duration-200"
        >
          {(isVerifying || isVerificationLoading || isProductLoading || isURILoading) 
            ? "Verifying On-Chain..." 
            : "🔍 Verify Luxury NFT"
          }
        </Button>

        {chainId && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Network: {chainId === 8453 ? 'Base Mainnet' : chainId === 84532 ? 'Base Sepolia' : `Chain ${chainId}`}
            </p>
          </div>
        )}
      </div>

      {verificationResult && (
        <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            {getStatusIcon(verificationResult.status)}
            <span className={`font-semibold ${getStatusColor(verificationResult.status)}`}>
              {verificationResult.status === NFT_VERIFICATION_STATUS.VERIFIED
                ? "✅ Verified Authentic"
                : verificationResult.status === NFT_VERIFICATION_STATUS.UNVERIFIED
                ? "❌ Not Verified"
                : "⚠️ Verification Error"}
            </span>
          </div>

          {verificationResult.nft ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <img
                  src={verificationResult.nft.image}
                  alt={verificationResult.nft.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                />
                <div>
                  <h3 className="font-semibold text-white">{verificationResult.nft.name}</h3>
                  <p className="text-sm text-gold-500">{verificationResult.nft.brand}</p>
                  <p className="text-xs text-gray-400">{verificationResult.nft.category}</p>
                </div>
              </div>

              {verificationResult.nft.attributes && (
                <div className="flex flex-wrap gap-2">
                  {verificationResult.nft.attributes.map((attr, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-xs rounded-md text-gray-300"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                <a
                  href={`https://sepolia.basescan.org/token/${LUXLINK_NFT_ADDRESS}?a=${tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gold-500 hover:text-gold-400 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on BaseScan</span>
                </a>
                <span className="text-xs text-green-400 font-semibold">On-Chain Verified</span>
              </div>

              {/* QR Code for sharing */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <NFTQRCode 
                  tokenId={tokenId}
                  contractAddress={LUXLINK_NFT_ADDRESS}
                  nftName={verificationResult.nft.name}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">{verificationResult.error}</p>
          )}
        </div>
      )}

      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500">
          💡 Enter any Token ID to verify luxury NFTs minted by registered manufacturers
        </p>
        <p className="text-xs text-gray-400">
          🏭 Only NFTs from verified luxury brands (Hermès, Gucci, Rolex, etc.) will show as authentic
        </p>
      </div>
    </div>
  );
}