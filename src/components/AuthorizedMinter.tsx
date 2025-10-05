"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Button } from "~/components/ui/Button";
import { ManufacturerMinter } from "~/components/ManufacturerMinter";
import { Lock, Unlock, Key, Shield, AlertTriangle, Network } from "lucide-react";

const AUTHORIZED_PRIVATE_KEY = "0x90c793c2f44238afbb822345a0296f1a56a53ce1b4a1328eb6c30bab04e5c396";

export function AuthorizedMinter() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [privateKey, setPrivateKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);

  const isOnBaseSepolia = chainId === baseSepolia.id;

  // Auto switch to Base Sepolia when authorized
  useEffect(() => {
    if (isAuthorized && isConnected && !isOnBaseSepolia) {
      handleNetworkSwitch();
    }
  }, [isAuthorized, isConnected, isOnBaseSepolia]);

  const handleNetworkSwitch = async () => {
    if (!switchChain) return;
    
    setIsNetworkSwitching(true);
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error("Failed to switch to Base Sepolia:", error);
      alert("Please manually switch to Base Sepolia network in your wallet.");
    } finally {
      setIsNetworkSwitching(false);
    }
  };

  const handleKeyCheck = () => {
    if (privateKey === AUTHORIZED_PRIVATE_KEY) {
      setIsAuthorized(true);
      setShowKeyInput(false);
    } else {
      alert("Invalid private key. Access denied.");
      setPrivateKey("");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPrivateKey("");
    setShowKeyInput(false);
  };

  if (isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gold-500 mb-2 flex items-center justify-center space-x-2">
              <Shield className="w-8 h-8" />
              <span>Authorized Minter</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Mint luxury NFTs with authorized access
            </p>
          </div>

          {/* Network Status */}
          <div className={`p-4 rounded-lg mb-6 border ${
            isOnBaseSepolia 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-yellow-900/20 border-yellow-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className={`w-5 h-5 ${
                  isOnBaseSepolia ? 'text-green-400' : 'text-yellow-400'
                }`} />
                <span className={`font-semibold ${
                  isOnBaseSepolia ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {isOnBaseSepolia ? 'Base Sepolia Connected' : 'Wrong Network'}
                </span>
              </div>
              {!isOnBaseSepolia && (
                <Button
                  onClick={handleNetworkSwitch}
                  disabled={isNetworkSwitching}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black text-sm px-3 py-1"
                >
                  {isNetworkSwitching ? 'Switching...' : 'Switch to Base Sepolia'}
                </Button>
              )}
            </div>
          </div>

          {/* Access Status */}
          <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Unlock className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Access Granted</span>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Minter Interface - Only show if on correct network */}
          {isOnBaseSepolia ? (
            <ManufacturerMinter />
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <Network className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Network Required</h3>
              <p className="text-gray-400 mb-4">
                Please switch to Base Sepolia network to access minting functionality.
              </p>
              <Button
                onClick={handleNetworkSwitch}
                disabled={isNetworkSwitching}
                className="bg-yellow-600 hover:bg-yellow-700 text-black"
              >
                {isNetworkSwitching ? 'Switching Networks...' : 'Switch to Base Sepolia'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold-500 mb-2">
            🔐 Authorized Access
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            Mint Luxury NFTs
          </h2>
          <p className="text-gray-400">
            Enter authorized private key to access minting
          </p>
        </div>

        {/* Access Control */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Restricted Access
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Only authorized users can mint luxury NFTs
            </p>
          </div>

          {!showKeyInput ? (
            <Button
              onClick={() => setShowKeyInput(true)}
              className="w-full bg-gold-600 hover:bg-gold-700 text-black font-semibold py-3"
            >
              <Key className="w-5 h-5 mr-2" />
              Enter Authorization Key
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Private Key
                </label>
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Enter your private key..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleKeyCheck}
                  disabled={!privateKey}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
                >
                  Verify Access
                </Button>
                <Button
                  onClick={() => {
                    setShowKeyInput(false);
                    setPrivateKey("");
                  }}
                  className="px-6 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-400 mb-1">Security Warning</h4>
              <p className="text-red-300 text-sm">
                Never share your private key with anyone. This key grants full access to minting capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-xl p-4">
          <h4 className="font-semibold text-gold-500 mb-2">Minting Features</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Mint authenticated luxury NFTs</li>
            <li>• Generate QR codes for products</li>
            <li>• Add product metadata and images</li>
            <li>• Deploy to Base blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}