"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { WalletConnectButton } from "./WalletConnectButton";
import { Button } from "./ui/Button";
import { useMintNFT, useIsManufacturer } from "~/contracts/LuxLinkNFT";
import { AlertCircle, CheckCircle, Package, Loader2 } from "lucide-react";

const AUTHORIZED_ADDRESS = "0xeA60bCEe9526E87b6a3155d238220213c6EaE6D4";
const AUTHORIZED_PRIVATE_KEY = "0x90c793c2f44238afbb822345a0296f1a56a53ce1b4a1328eb6c30bab04e5c396";

export function AuthorizedMinter() {
  const { isConnected, address } = useAccount();
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mintingTo, setMintingTo] = useState("");
  
  const { mintNFT, isPending, isConfirming, isConfirmed, error } = useMintNFT();
  const { data: isManufacturer } = useIsManufacturer(address);

  // Check if connected wallet is the authorized address
  const isAuthorized = address?.toLowerCase() === AUTHORIZED_ADDRESS.toLowerCase();

  const createSignature = async (productId: string, metadataURI: string, manufacturer: string) => {
    try {
      const wallet = new ethers.Wallet(AUTHORIZED_PRIVATE_KEY);
      
      // Create the message hash exactly as the contract does
      const messageHash = ethers.solidityPackedKeccak256(
        ["string", "string", "address"],
        [productId, metadataURI, manufacturer]
      );
      
      // Sign the message hash
      const signature = await wallet.signMessage(ethers.getBytes(messageHash));
      return signature;
    } catch (error) {
      console.error("Error creating signature:", error);
      throw error;
    }
  };

  const handleMint = async () => {
    if (!productId || !productName || !description || !mintingTo) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Create metadata
      const metadata = {
        name: productName,
        description: description,
        image: imageUrl || "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        attributes: [
          { trait_type: "Product ID", value: productId },
          { trait_type: "Minted By", value: "LuxLink Authorized" },
          { trait_type: "Manufacturer", value: "LuxLink Authorized" }
        ]
      };

      // For demo, we'll use a simple metadata URI (in real app, upload to IPFS)
      const metadataURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      // Create proper signature using the authorized private key
      const signature = await createSignature(productId, metadataURI, address!);

      console.log("Minting with:", {
        to: mintingTo,
        productId,
        metadataURI,
        signature
      });

      await mintNFT(
        mintingTo as `0x${string}`, 
        productId, 
        metadataURI, 
        signature as `0x${string}`
      );

      // Clear form after successful mint
      setProductId("");
      setProductName("");
      setDescription("");
      setImageUrl("");
      setMintingTo("");

    } catch (err) {
      console.error("Minting error:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <Package className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gold-500 mb-2">Authorized Minter</h2>
          <p className="text-gray-400">Connect your authorized wallet to mint luxury NFTs</p>
        </div>
        <WalletConnectButton />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            Only the authorized address can mint tokens
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-300">Your address:</p>
            <p className="text-sm text-red-400 font-mono">{address}</p>
            <p className="text-sm text-gray-300 mt-2">Authorized address:</p>
            <p className="text-sm text-green-400 font-mono">{AUTHORIZED_ADDRESS}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-green-400 mb-2">✅ Authorized Minter</h2>
        <p className="text-gray-400">You are authorized to mint luxury NFTs</p>
        <p className="text-xs text-gray-500 mt-1">Manufacturer Status: {isManufacturer ? '✅ Registered' : '❌ Not Registered'}</p>
      </div>

      {isConfirmed && (
        <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-semibold">NFT Minted Successfully!</p>
          <p className="text-sm text-gray-400">Token has been added to the recipient's wallet</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 text-sm">{error.message}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Product ID *
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="e.g., LUX-001-2024"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Luxury Watch Collection #1"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the luxury product..."
            rows={3}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/luxury-item.jpg"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Mint To Address *
          </label>
          <input
            type="text"
            value={mintingTo}
            onChange={(e) => setMintingTo(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            The wallet address that will receive the NFT
          </p>
        </div>

        <Button
          onClick={handleMint}
          disabled={isPending || isConfirming || !productId || !productName || !description || !mintingTo}
          className="w-full bg-gold-600 hover:bg-gold-700 text-black font-semibold py-3"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? "Confirm in Wallet..." : "Minting..."}
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              Mint Luxury NFT
            </>
          )}
        </Button>
      </div>
    </div>
  );
}