"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { Wallet, LogOut, User, AlertCircle } from "lucide-react";
import { useState } from "react";

export function WalletConnectButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock basename for demo - in real app this would come from Base Name Service
  const mockBasename = address ? `${address.slice(2, 8)}.base.eth` : null;

  const handleConnect = async (connector: any) => {
    setIsConnecting(true);
    try {
      await connect({ connector });
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3 bg-gray-800 p-3 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-gold-500 p-2 rounded-full">
            <User className="w-4 h-4 text-black" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">
              {mockBasename || truncateAddress(address)}
            </div>
            <div className="text-xs text-gray-400">
              {truncateAddress(address)} • {chain?.name || 'Unknown'}
            </div>
          </div>
        </div>
        <Button
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">
            {error.message || 'Connection failed. Please try again.'}
          </span>
        </div>
      )}

      <div className="space-y-2">
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={isPending || isConnecting}
            className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gray-600 text-black font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Wallet className="w-5 h-5" />
            <span>
              {isPending || isConnecting ? 'Connecting...' : `Connect ${connector.name}`}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Connect your wallet to verify and showcase luxury NFTs on Base
        </p>
      </div>
    </div>
  );
}