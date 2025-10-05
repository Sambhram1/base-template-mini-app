"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { Button } from "~/components/ui/Button";
import { ShareButton } from "~/components/ui/Share";
import { NFTMetadata } from "~/types/luxlink";
import { useMintNFT, useIsManufacturer, LUXLINK_NFT_ADDRESS } from "~/contracts/LuxLinkNFT";
import { keccak256, toHex } from "viem";
import { Camera, X, Zap, Shield, Upload, Image as ImageIcon } from "lucide-react";

interface ManufacturerMinterProps {
  userFid?: number;
  onNFTMinted?: (nft: NFTMetadata) => void;
}

export function ManufacturerMinter({ userFid, onNFTMinted }: ManufacturerMinterProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  // Contract hooks
  const { data: isManufacturer, isLoading: isCheckingManufacturer } = useIsManufacturer(address);
  const { mintNFT, hash, error: mintError, isPending, isConfirming, isConfirmed } = useMintNFT();

  // Form state
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState(address || "");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update recipient when wallet changes
  useEffect(() => {
    if (address) {
      setRecipient(address);
    }
  }, [address]);

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file too large. Please select an image under 5MB.");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert image to base64 for metadata
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleMintNFT = useCallback(async () => {
    if (!address || !productId || !productName || !brandName) {
      return;
    }

    if (!selectedImage) {
      alert("Please select an image for your product.");
      return;
    }

    setIsProcessing(true);

    try {
      // Convert image to base64 for metadata
      const imageBase64 = await convertImageToBase64(selectedImage);
      
      // Create metadata with uploaded image
      const metadata = {
        name: productName,
        description: description || `Authentic ${brandName} luxury product`,
        image: imageBase64, // Use the uploaded image as base64
        attributes: [
          { trait_type: "Brand", value: brandName },
          { trait_type: "Category", value: category || "Luxury Item" },
          { trait_type: "Product ID", value: productId },
          { trait_type: "Authenticity", value: "Verified" },
          { trait_type: "Minted By", value: address },
          { trait_type: "Image Type", value: selectedImage.type },
          { trait_type: "Image Size", value: `${(selectedImage.size / 1024).toFixed(1)} KB` }
        ]
      };

      // Create data URI with base64 encoded metadata
      const metadataJSON = JSON.stringify(metadata);
      const metadataBase64 = btoa(metadataJSON);
      const metadataURI = `data:application/json;base64,${metadataBase64}`;

      // Create message hash for signing (keccak256 of productId, metadataURI, manufacturer)
      const messageData = `${productId}${metadataURI}${address}`;
      const messageHash = keccak256(toHex(messageData));

      // Sign the message hash
      const signature = await signMessageAsync({
        message: { raw: messageHash }
      });

      // Mint the NFT
      mintNFT(
        recipient as `0x${string}`,
        productId,
        metadataURI,
        signature as `0x${string}`
      );

    } catch (error) {
      console.error("Minting error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [address, productId, productName, brandName, description, category, recipient, signMessageAsync, mintNFT]);

  // Reset form on successful mint
  useEffect(() => {
    if (isConfirmed) {
      setProductId("");
      setProductName("");
      setBrandName("");
      setCategory("");
      setDescription("");
      handleRemoveImage(); // Clear the image
      
      // Create NFT metadata for callback
      if (onNFTMinted) {
        const nftMetadata: NFTMetadata = {
          id: `minted-${Date.now()}`,
          name: productName,
          description: description || `Authentic ${brandName} luxury product`,
          image: imagePreview || "",
          contractAddress: LUXLINK_NFT_ADDRESS,
          tokenId: "pending", // Will be updated when transaction confirms
          brand: brandName,
          category: category || "Luxury Item"
        };
        onNFTMinted(nftMetadata);
      }
    }
  }, [isConfirmed, onNFTMinted, productName, brandName, description, category, imagePreview]);

  if (!address) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <Shield className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
          <p className="text-gray-400 text-sm">
            Connect your wallet to access manufacturer minting tools
          </p>
        </div>
      </div>
    );
  }

  if (isCheckingManufacturer) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gold-500 font-semibold">Checking manufacturer status...</p>
      </div>
    );
  }

  if (!isManufacturer) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-900/20 border border-red-700 p-6 rounded-xl">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
          <p className="text-gray-400 text-sm mb-4">
            Your wallet address is not registered as a luxury manufacturer on LuxLink.
          </p>
          <p className="text-xs text-gray-500">
            Only verified luxury brands can mint NFTs. Contact support to register your brand.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
          <Zap className="w-6 h-6" />
          <span>Mint Luxury NFT</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Create authenticated luxury product NFTs as a verified manufacturer
        </p>
      </div>

      {/* Manufacturer Status */}
      <div className="bg-green-900/20 border border-green-700 p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-semibold">Verified Manufacturer</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          You are authorized to mint luxury NFTs on the LuxLink platform
        </p>
      </div>

      {/* Minting Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product ID *
            </label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="PROD-2024-001"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Hermès"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Birkin 35 Orange Togo Leather"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
          >
            <option value="">Select Category</option>
            <option value="Handbag">Handbag</option>
            <option value="Watch">Watch</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Shoes">Shoes</option>
            <option value="Clothing">Clothing</option>
            <option value="Fragrance">Fragrance</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the luxury product..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none text-sm"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Image *
          </label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gold-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">Upload product image</p>
              <p className="text-xs text-gray-500 mb-4">
                JPG, PNG, GIF up to 5MB
              </p>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="border border-gray-600 rounded-lg p-2">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-400">
                  {selectedImage?.name} ({((selectedImage?.size || 0) / 1024).toFixed(1)} KB)
                </div>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                >
                  <X className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mint To Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave as your address or specify a different recipient
          </p>
        </div>

        <Button
          onClick={handleMintNFT}
          disabled={!productId || !productName || !brandName || !recipient || !selectedImage || isProcessing || isPending || isConfirming}
          isLoading={isProcessing || isPending || isConfirming}
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-xl transition-all duration-200"
        >
          {(isProcessing || isPending || isConfirming) ? "Minting NFT..." : "🏭 Mint Luxury NFT"}
        </Button>

        {mintError && (
          <div className="bg-red-900/20 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 text-sm">
              Minting failed: {mintError.message || "Unknown error"}
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 text-sm">
              ✅ NFT minted successfully! Check your wallet and the verification tab.
            </p>
            {hash && (
              <p className="text-xs text-gray-400 mt-1">
                Transaction: <a href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">{hash.slice(0, 10)}...</a>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔐 NFTs are cryptographically signed with your manufacturer key for authenticity
        </p>
      </div>
    </div>
  );
}