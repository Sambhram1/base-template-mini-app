"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "~/components/WalletConnectButton";
import { NFTVerifier } from "~/components/NFTVerifier";
import { WalletNFTViewer } from "~/components/WalletNFTViewer";
import { Feed } from "~/components/Feed";
import { PostComposer } from "~/components/PostComposer";
import { Button } from "~/components/ui/Button";
import { NFTMetadata, Post } from "~/types/luxlink";
import { User, Wallet, Shield, Search, Image, Share } from "lucide-react";

interface UserSectionProps {
  posts: Post[];
  onPostReaction: (postId: string, reaction: string) => void;
  onPostCreated: (post: Post) => void;
  userFid?: number;
  neynarUser?: any;
}

type UserSubTab = 'overview' | 'verify' | 'wallet' | 'feed' | 'post';

export function UserSection({ posts, onPostReaction, onPostCreated, userFid, neynarUser }: UserSectionProps) {
  const { isConnected, address } = useAccount();
  const [activeSubTab, setActiveSubTab] = useState<UserSubTab>('overview');
  const [verifiedNFT, setVerifiedNFT] = useState<NFTMetadata | null>(null);

  const handleNFTVerified = (nft: NFTMetadata) => {
    setVerifiedNFT(nft);
    setActiveSubTab('post');
  };

  if (!isConnected) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <User className="w-8 h-8" />
            <span>User Portal</span>
          </h2>
          <p className="text-gray-400">
            Connect your wallet to verify NFTs, manage your collection, and interact with the luxury community
          </p>
        </div>

        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-xl p-6">
          <div className="text-center mb-6">
            <Wallet className="w-16 h-16 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gold-500 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-300 mb-6">
              Access all LuxLink features including NFT verification, wallet management, and social interactions
            </p>
          </div>
          
          <WalletConnectButton />
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white text-sm mb-1">Verify NFTs</h4>
              <p className="text-xs text-gray-400">Check authenticity of luxury items</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <Wallet className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-white text-sm mb-1">Manage Collection</h4>
              <p className="text-xs text-gray-400">View and share your luxury NFTs</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* User Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <User className="w-6 h-6" />
            <span>User Portal</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Verify authenticity, manage collection, and share luxury NFTs
          </p>
        </div>

        {/* Connected Status */}
        <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold text-sm">Connected</span>
            </div>
            <span className="text-xs text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'overview' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('verify')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'verify' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Verify
          </button>
          <button
            onClick={() => setActiveSubTab('wallet')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'wallet' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'feed' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveSubTab('post')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'post' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Post
          </button>
        </div>
      </div>

      {/* Sub-tab Content */}
      <div className="min-h-[400px]">
        {activeSubTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveSubTab('verify')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl h-auto"
              >
                <div className="text-center">
                  <Search className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold mb-1">Verify NFT</div>
                  <div className="text-xs opacity-90">Check authenticity</div>
                </div>
              </Button>
              
              <Button
                onClick={() => setActiveSubTab('wallet')}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl h-auto"
              >
                <div className="text-center">
                  <Wallet className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold mb-1">My Collection</div>
                  <div className="text-xs opacity-90">View NFTs</div>
                </div>
              </Button>
            </div>

            {/* Profile Info */}
            <div className="bg-gray-800 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-3">Profile</h3>
              <div className="space-y-2">
                {neynarUser && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">FID:</span>
                    <span className="text-white text-sm">{userFid}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Wallet:</span>
                  <span className="text-white text-sm">{address?.slice(0, 10)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Network:</span>
                  <span className="text-green-400 text-sm">Base Sepolia</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'verify' && (
          <NFTVerifier onNFTVerified={handleNFTVerified} />
        )}

        {activeSubTab === 'wallet' && (
          <WalletNFTViewer />
        )}

        {activeSubTab === 'feed' && (
          <Feed posts={posts} onPostReaction={onPostReaction} />
        )}

        {activeSubTab === 'post' && (
          <PostComposer
            verifiedNFT={verifiedNFT || undefined}
            userFid={userFid}
            onPostCreated={(post) => {
              onPostCreated(post);
              setVerifiedNFT(null);
              setActiveSubTab('feed');
            }}
          />
        )}
      </div>
    </div>
  );
}