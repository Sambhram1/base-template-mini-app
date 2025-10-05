"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { ShareButton } from "~/components/ui/Share";
import { NFTMetadata } from "~/types/luxlink";
import { Camera, X, Upload } from "lucide-react";

interface PostComposerProps {
  verifiedNFT?: NFTMetadata;
  userFid?: number;
  onPostCreated?: (post: any) => void;
}

export function PostComposer({ verifiedNFT, userFid, onPostCreated }: PostComposerProps) {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(!verifiedNFT);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setShowImageUpload(true);
  }, []);

  const createPost = useCallback(async () => {
    if (!caption.trim() && !verifiedNFT && !selectedImage) {
      return;
    }

    setIsPosting(true);

    try {
      // Simulate posting delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPost = {
        id: Date.now().toString(),
        authorFid: userFid || 1,
        authorUsername: "luxuryCollector",
        authorBasename: "luxury.base.eth",
        caption: caption.trim(),
        timestamp: Date.now(),
        nft: verifiedNFT || {
          id: `custom-${Date.now()}`,
          name: "Custom Luxury Item",
          description: caption,
          image: selectedImage || "/api/placeholder/400/400?text=Luxury+Item",
          contractAddress: "0x...",
          tokenId: "0"
        },
        reactions: {
          love: 0,
          fire: 0,
          diamond: 0,
          total: 0,
          userReactions: []
        },
        isVerified: !!verifiedNFT,
        verificationStatus: verifiedNFT ? 'verified' : 'unverified'
      };

      onPostCreated?.(newPost);

      // Reset form
      setCaption("");
      setSelectedImage(null);
      setShowImageUpload(!verifiedNFT);

    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  }, [caption, verifiedNFT, selectedImage, userFid, onPostCreated]);

  const displayImage = verifiedNFT?.image || selectedImage;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-500 mb-2">✨ Share Luxury Item</h2>
        <p className="text-gray-400 text-sm">
          Showcase your verified luxury NFTs to the community
        </p>
      </div>

      {/* Image Section */}
      {displayImage ? (
        <div className="relative">
          <img
            src={displayImage}
            alt="Luxury item"
            className="w-full h-64 object-cover rounded-xl bg-gray-800"
          />
          {verifiedNFT && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1">
              <span>✅</span>
              <span>Verified</span>
            </div>
          )}
          {!verifiedNFT && (
            <button
              onClick={removeImage}
              className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : showImageUpload && (
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gold-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            <div className="bg-gray-700 p-4 rounded-full">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Upload luxury item image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </label>
        </div>
      )}

      {/* NFT Details */}
      {verifiedNFT && (
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gold-500 p-2 rounded-lg">
              <span className="text-black font-bold text-sm">NFT</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{verifiedNFT.name}</h3>
              <p className="text-sm text-gold-500">{verifiedNFT.brand}</p>
              <p className="text-xs text-gray-400">Token #{verifiedNFT.tokenId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Caption Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={verifiedNFT 
            ? "Share your thoughts about this luxury piece..."
            : "Describe your luxury item..."
          }
          rows={4}
          maxLength={280}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {caption.length}/280 characters
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={createPost}
          disabled={(!caption.trim() && !verifiedNFT && !selectedImage) || isPosting}
          isLoading={isPosting}
          className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-xl transition-all duration-200"
        >
          {isPosting ? "Posting..." : "📤 Post to Feed"}
        </Button>

        {verifiedNFT && (
          <ShareButton
            buttonText="Share to Farcaster"
            cast={{
              text: `Check out my verified ${verifiedNFT.brand} NFT on LuxLink! 💎✨\n\n${caption}`,
              embeds: [verifiedNFT.image]
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          />
        )}
      </div>

      {/* Tips */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Verified NFTs get higher engagement and trust scores
        </p>
      </div>
    </div>
  );
}