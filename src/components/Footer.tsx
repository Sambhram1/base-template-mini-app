import { Tab } from "~/types/luxlink";

interface FooterProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Footer({ activeTab, onTabChange }: FooterProps) {
  const tabs = [
    {
      id: 'scan' as Tab,
      label: 'Scan QR Code',
      subtitle: 'Verify luxury NFTs',
      icon: '📱',
    },
    {
      id: 'mint' as Tab,
      label: 'Mint NFT',
      subtitle: 'Authorized access only',
      icon: '🔐',
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center space-y-1 py-2 px-1 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="text-xl">{tab.icon}</div>
              <div className="text-xs font-semibold">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.subtitle}</div>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}