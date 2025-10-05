import React from "react";
import type { Tab } from "~/types/luxlink";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 bg-gray-900 border-2 border-gold-500/30 px-2 py-3 rounded-xl z-50 backdrop-blur-sm">
    <div className="flex justify-around items-center h-16">
      <button
        onClick={() => setActiveTab('user')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
          activeTab === 'user' ? 'text-gold-500' : 'text-gray-400'
        }`}
      >
        <span className="text-2xl">�</span>
        <span className="text-sm mt-1 font-medium">User</span>
        <span className="text-xs text-gray-500">Verify • Wallet • Profile</span>
      </button>
      <button
        onClick={() => setActiveTab('manufacturer')}
        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
          activeTab === 'manufacturer' ? 'text-gold-500' : 'text-gray-400'
        }`}
      >
        <span className="text-2xl">🏭</span>
        <span className="text-sm mt-1 font-medium">Manufacturer</span>
        <span className="text-xs text-gray-500">Mint • Manage • Brands</span>
      </button>
    </div>
  </div>
);