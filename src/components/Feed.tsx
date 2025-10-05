"use client";

import { useState, useEffect } from "react";
import { Post } from "~/types/luxlink";
import { ReactionBar } from "./ReactionBar";
import { CheckCircle, Clock, AlertTriangle, ExternalLink, MessageCircle } from "lucide-react";

interface FeedProps {
  posts?: Post[];
  onPostReaction?: (postId: string, reaction: string) => void;
}

// Mock data for demo
const mockPosts: Post[] = [
  {
    id: "1",
    authorFid: 12345,
    authorUsername: "luxurycollector",
    authorBasename: "luxury.base.eth",
    authorAvatar: "/api/placeholder/40/40?text=LC",
    caption: "Just acquired this stunning Hermès piece! The craftsmanship is incredible ✨ #LuxuryLife #NFT",
    timestamp: Date.now() - 3600000, // 1 hour ago
    nft: {
      id: "hermes-1",
      name: "Hermès Birkin #1247",
      description: "Authentic Hermès Birkin bag, Orange leather with gold hardware",
      image: "/api/placeholder/400/400?text=Hermès+Birkin",
      contractAddress: "0x1234...5678",
      tokenId: "1247",
      brand: "Hermès",
      category: "Handbag",
      attributes: [
        { trait_type: "Authenticity", value: "Verified" },
        { trait_type: "Condition", value: "Mint" },
        { trait_type: "Rarity", value: "Ultra Rare" }
      ]
    },
    reactions: {
      love: 24,
      fire: 18,
      diamond: 31,
      total: 73,
      userReactions: []
    },
    isVerified: true,
    verificationStatus: "verified"
  },
  {
    id: "2",
    authorFid: 54321,
    authorUsername: "watchmaster",
    authorBasename: "time.base.eth",
    authorAvatar: "/api/placeholder/40/40?text=WM",
    caption: "Rolex Daytona from 1967. Vintage pieces like this are pure art 🕰️ Looking for trades!",
    timestamp: Date.now() - 7200000, // 2 hours ago
    nft: {
      id: "rolex-1967",
      name: "Rolex Daytona 1967 #0456",
      description: "Vintage Rolex Daytona with original documentation",
      image: "/api/placeholder/400/400?text=Rolex+Daytona",
      contractAddress: "0xabcd...efgh",
      tokenId: "0456",
      brand: "Rolex",
      category: "Watch",
      attributes: [
        { trait_type: "Authenticity", value: "Verified" },
        { trait_type: "Year", value: "1967" },
        { trait_type: "Rarity", value: "Legendary" }
      ]
    },
    reactions: {
      love: 45,
      fire: 67,
      diamond: 89,
      total: 201,
      userReactions: ["fire"]
    },
    isVerified: true,
    verificationStatus: "verified"
  },
  {
    id: "3",
    authorFid: 98765,
    authorUsername: "fashionista",
    authorBasename: "style.base.eth", 
    authorAvatar: "/api/placeholder/40/40?text=FS",
    caption: "Chanel No. 5 limited edition from the NFT collection 💎 Still verifying authenticity...",
    timestamp: Date.now() - 10800000, // 3 hours ago
    nft: {
      id: "chanel-limited",
      name: "Chanel No. 5 Limited #0089",
      description: "Limited edition Chanel fragrance NFT",
      image: "/api/placeholder/400/400?text=Chanel+No.5",
      contractAddress: "0xfghi...jklm",
      tokenId: "0089",
      brand: "Chanel",
      category: "Fragrance",
    },
    reactions: {
      love: 12,
      fire: 8,
      diamond: 5,
      total: 25,
      userReactions: []
    },
    isVerified: false,
    verificationStatus: "pending"
  }
];

export function Feed({ posts = mockPosts, onPostReaction }: FeedProps) {
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "unverified":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified Authentic";
      case "pending":
        return "Verification Pending";
      case "unverified":
        return "Unverified";
      default:
        return "Unknown";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "unverified":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleReaction = (postId: string, reaction: string) => {
    onPostReaction?.(postId, reaction);
    
    // Update local state for immediate feedback
    setFeedPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const wasReacted = post.reactions.userReactions.includes(reaction);
          const newUserReactions = wasReacted
            ? post.reactions.userReactions.filter(r => r !== reaction)
            : [...post.reactions.userReactions, reaction];
          
          const newReactions = { ...post.reactions };
          newReactions[reaction as keyof typeof newReactions] += wasReacted ? -1 : 1;
          newReactions.total += wasReacted ? -1 : 1;
          newReactions.userReactions = newUserReactions;

          return { ...post, reactions: newReactions };
        }
        return post;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-500">Loading luxury feed...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gold-500 mb-2">💎 Luxury Feed</h2>
        <p className="text-gray-400 text-sm">
          Discover verified luxury NFTs from collectors worldwide
        </p>
      </div>

      {feedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No posts yet. Be the first to share your luxury NFT!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden hover:border-gold-500/30 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.authorAvatar || `/api/placeholder/40/40?text=${post.authorUsername[0].toUpperCase()}`}
                    alt={post.authorUsername}
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{post.authorUsername}</span>
                      {post.authorBasename && (
                        <span className="text-gold-500 text-sm">@{post.authorBasename}</span>
                      )}
                    </div>
                    <span className="text-gray-400 text-sm">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>
                
                {/* Verification Status */}
                <div className={`flex items-center space-x-1 ${getVerificationColor(post.verificationStatus)}`}>
                  {getVerificationIcon(post.verificationStatus)}
                  <span className="text-xs font-medium">{getVerificationText(post.verificationStatus)}</span>
                </div>
              </div>

              {/* NFT Image */}
              <div className="relative">
                <img
                  src={post.nft.image}
                  alt={post.nft.name}
                  className="w-full h-80 object-cover bg-gray-800"
                />
                {post.isVerified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* NFT Details */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white">{post.nft.name}</h3>
                    <p className="text-gold-500 font-semibold">{post.nft.brand}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gold-500 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
                
                {post.nft.attributes && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.nft.attributes.slice(0, 3).map((attr, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800 text-xs rounded-md text-gray-300 border border-gray-600"
                      >
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-gray-200">{post.caption}</p>
                </div>
              )}

              {/* Reactions */}
              <div className="p-4">
                <ReactionBar
                  reactions={post.reactions}
                  onReaction={(reaction) => handleReaction(post.id, reaction)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      <div className="text-center pt-6">
        <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gold-500 font-semibold rounded-xl transition-colors">
          Load More Posts
        </button>
      </div>
    </div>
  );
}