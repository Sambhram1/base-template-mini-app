"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { LUXLINK_NFT_ADDRESS, LUXLINK_NFT_ABI } from "~/contracts/LuxLinkNFT";
import { NFTQRCode } from "~/components/NFTQRCode";
import { Button } from "~/components/ui/Button";
import { Wallet, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { type Address } from "viem";

interface WalletNFT {
  tokenId: string;
  name: string;
  brand: string;
  productId: string;
  image: string;
  isVerified: boolean;
}

export function WalletNFTViewer() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<WalletNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<WalletNFT | null>(null);

  // Get user's NFT balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: LUXLINK_NFT_ADDRESS,
    abi: LUXLINK_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Function to fetch NFT details for owned tokens
  const fetchUserNFTs = async () => {
    if (!address || !balance || balance === 0n) return;

    setIsLoading(true);
    try {
      const userNFTs: WalletNFT[] = [];
      
      // In a real app, you'd use events or indexing to get token IDs
      // For demo, we'll check the first 100 tokens (not efficient but works for testing)
      for (let i = 1; i <= Math.min(Number(balance) + 50, 100); i++) {
        try {
          // Check if this token is owned by the user
          const { data: owner } = await useReadContract({
            address: LUXLINK_NFT_ADDRESS,
            abi: LUXLINK_NFT_ABI,
            functionName: 'ownerOf',
            args: [BigInt(i)],
          });

          if (owner === address) {
            // Get product details
            const { data: productDetails } = await useReadContract({
              address: LUXLINK_NFT_ADDRESS,
              abi: LUXLINK_NFT_ABI,
              functionName: 'getProductDetails',
              args: [BigInt(i)],
            });

            // Get verification status
            const { data: verificationResult } = await useReadContract({
              address: LUXLINK_NFT_ADDRESS,
              abi: LUXLINK_NFT_ABI,
              functionName: 'verifyAuthenticity',
              args: [BigInt(i)],
            });

            if (productDetails && verificationResult) {
              const [isAuthentic, , , brandName] = verificationResult;
              const { productId, isVerified } = productDetails;

              userNFTs.push({
                tokenId: i.toString(),
                name: `${brandName} #${productId}`,
                brand: brandName,
                productId,
                image: `/api/placeholder/200/200?text=${encodeURIComponent(brandName)}`,
                isVerified: isAuthentic && isVerified
              });
            }
          }
        } catch (error) {
          // Token might not exist or other error, continue
          continue;
        }
      }

      setNfts(userNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh NFTs when balance changes
  useEffect(() => {
    if (address && balance !== undefined) {
      fetchUserNFTs();
    }
  }, [address, balance]);

  const handleRefresh = () => {
    refetchBalance();
    fetchUserNFTs();
  };

  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <Wallet className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400 text-sm">
            Connect your wallet to view your luxury NFT collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span>My Luxury NFTs</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Your verified luxury NFT collection
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Balance Display */}
      <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total NFTs</p>
            <p className="text-2xl font-bold text-gold-500">{balance ? balance.toString() : '0'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Verified</p>
            <p className="text-lg font-semibold text-green-400">
              {nfts.filter(nft => nft.isVerified).length}
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your NFTs...</p>
        </div>
      )}

      {/* NFT Grid */}
      {!isLoading && nfts.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{nft.name}</h3>
                      <p className="text-gold-500 text-xs">{nft.brand}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {nft.isVerified && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">#{nft.tokenId}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">ID: {nft.productId}</p>
                    
                    <div className="flex space-x-2">
                      <NFTQRCode
                        tokenId={nft.tokenId}
                        contractAddress={LUXLINK_NFT_ADDRESS}
                        nftName={nft.name}
                      />
                      
                      <a
                        href={`https://sepolia.basescan.org/token/${LUXLINK_NFT_ADDRESS}?a=${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gold-500 hover:text-gold-400 text-xs transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && nfts.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No NFTs Found</h3>
            <p className="text-gray-500 text-sm mb-4">
              You don't have any luxury NFTs yet. Mint your first NFT as a manufacturer or acquire verified luxury NFTs.
            </p>
            <Button
              onClick={handleRefresh}
              className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-2 rounded-lg"
            >
              Refresh Collection
            </Button>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          💎 Only verified luxury NFTs from registered manufacturers are displayed
        </p>
      </div>
    </div>
  );
}