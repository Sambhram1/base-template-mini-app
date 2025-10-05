"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "~/components/WalletConnectButton";
import { ManufacturerMinter } from "~/components/ManufacturerMinter";
import { Button } from "~/components/ui/Button";
import { useIsManufacturer } from "~/contracts/LuxLinkNFT";
import { Factory, Shield, Award, Settings, TrendingUp, Package } from "lucide-react";

type ManufacturerSubTab = 'overview' | 'mint' | 'manage' | 'analytics';

export function ManufacturerSection() {
  const { isConnected, address } = useAccount();
  const [activeSubTab, setActiveSubTab] = useState<ManufacturerSubTab>('overview');
  
  const { data: isManufacturer, isLoading: isCheckingManufacturer } = useIsManufacturer({
    address: address!,
  });

  const [mintedCount, setMintedCount] = useState(0);

  const handleMintSuccess = () => {
    setMintedCount(prev => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <Factory className="w-8 h-8" />
            <span>Manufacturer Portal</span>
          </h2>
          <p className="text-gray-400">
            Connect your wallet to access manufacturer tools and mint authenticated luxury NFTs
          </p>
        </div>

        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-xl p-6">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gold-500 mb-2">
              Verified Manufacturers Only
            </h3>
            <p className="text-gray-300 mb-6">
              This portal is restricted to registered luxury manufacturers with verified credentials
            </p>
          </div>
          
          <WalletConnectButton />
          
          <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-white text-sm mb-2">Manufacturer Benefits:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Mint authenticated NFTs for luxury products</li>
              <li>• Manage product authenticity certificates</li>
              <li>• Track product lifecycle and ownership</li>
              <li>• Access premium analytics and insights</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingManufacturer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying manufacturer credentials...</p>
        </div>
      </div>
    );
  }

  if (!isManufacturer) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <Factory className="w-8 h-8" />
            <span>Manufacturer Portal</span>
          </h2>
        </div>

        <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-300 mb-4">
            Your wallet ({address?.slice(0, 10)}...) is not registered as a verified manufacturer.
          </p>
          
          <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-white text-sm mb-2">To become a verified manufacturer:</h4>
            <ol className="text-xs text-gray-400 text-left space-y-1">
              <li>1. Contact LuxLink support with your business credentials</li>
              <li>2. Complete the verification process</li>
              <li>3. Get your wallet address registered on-chain</li>
              <li>4. Access all manufacturer features</li>
            </ol>
          </div>

          <Button className="bg-gold-600 hover:bg-gold-700 text-black">
            Contact Support
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <Package className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">Product Authentication</h4>
            <p className="text-xs text-gray-400">Mint NFTs for luxury items</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm mb-1">Analytics Dashboard</h4>
            <p className="text-xs text-gray-400">Track minting and ownership</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Manufacturer Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
            <Factory className="w-6 h-6" />
            <span>Manufacturer Portal</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Mint authenticated NFTs and manage luxury product certificates
          </p>
        </div>

        {/* Verified Status */}
        <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">Verified Manufacturer</span>
            </div>
            <span className="text-xs text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-gold-500">{mintedCount}</div>
            <div className="text-xs text-gray-400">NFTs Minted</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-400">Active</div>
            <div className="text-xs text-gray-400">Status</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-400">Base</div>
            <div className="text-xs text-gray-400">Network</div>
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
            onClick={() => setActiveSubTab('mint')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'mint' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mint NFT
          </button>
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'manage' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Manage
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'analytics' 
                ? 'bg-gold-500 text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Analytics
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
                onClick={() => setActiveSubTab('mint')}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl h-auto"
              >
                <div className="text-center">
                  <Package className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold mb-1">Mint NFT</div>
                  <div className="text-xs opacity-90">Create product certificate</div>
                </div>
              </Button>
              
              <Button
                onClick={() => setActiveSubTab('analytics')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl h-auto"
              >
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold mb-1">View Analytics</div>
                  <div className="text-xs opacity-90">Track performance</div>
                </div>
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 p-4 rounded-xl">
              <h3 className="font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <span className="text-gray-300 text-sm">NFTs Minted Today</span>
                  <span className="text-gold-500 font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <span className="text-gray-300 text-sm">Total Minted</span>
                  <span className="text-green-400 font-semibold">{mintedCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300 text-sm">Network Status</span>
                  <span className="text-blue-400 font-semibold">Base Sepolia</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-xl p-4">
              <h3 className="font-semibold text-gold-500 mb-2">Manufacturer Tips</h3>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Always include high-quality product images in metadata</li>
                <li>• Use detailed descriptions for better authenticity</li>
                <li>• Keep serial numbers and product codes accurate</li>
                <li>• Monitor your minted NFTs for verification requests</li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === 'mint' && (
          <ManufacturerMinter onMintSuccess={handleMintSuccess} />
        )}

        {activeSubTab === 'manage' && (
          <div className="p-6 space-y-6">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Management Tools</h3>
              <p className="text-gray-400 mb-6">
                Advanced management features coming soon
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-white mb-2">Product Catalog</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Manage your product templates and metadata
                </p>
                <Button disabled className="w-full bg-gray-700 text-gray-400">
                  Coming Soon
                </Button>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-white mb-2">Batch Minting</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Mint multiple NFTs in a single transaction
                </p>
                <Button disabled className="w-full bg-gray-700 text-gray-400">
                  Coming Soon
                </Button>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h4 className="font-semibold text-white mb-2">Ownership Tracking</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Track your products through the ownership chain
                </p>
                <Button disabled className="w-full bg-gray-700 text-gray-400">
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'analytics' && (
          <div className="p-6 space-y-6">
            <div className="text-center mb-6">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400">
                Track your NFT minting performance and product verification rates
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-400">{mintedCount}</div>
                <div className="text-sm text-green-300">Total NFTs Minted</div>
                <div className="text-xs text-gray-400 mt-1">All time</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-sm text-blue-300">Verifications Today</div>
                <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-purple-300">Success Rate</div>
                <div className="text-xs text-gray-400 mt-1">Minting success</div>
              </div>
              
              <div className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 border border-gold-700 p-4 rounded-xl">
                <div className="text-2xl font-bold text-gold-400">Active</div>
                <div className="text-sm text-gold-300">Status</div>
                <div className="text-xs text-gray-400 mt-1">Verified manufacturer</div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h4 className="font-semibold text-white mb-4">Minting Activity (Last 30 Days)</h4>
              <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}