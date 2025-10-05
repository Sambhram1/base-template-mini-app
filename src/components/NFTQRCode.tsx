"use client";

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from "~/components/ui/Button";
import { QrCode, X, Download, Share } from 'lucide-react';

interface NFTQRCodeProps {
  tokenId: string;
  contractAddress: string;
  nftName?: string;
}

export function NFTQRCode({ tokenId, contractAddress, nftName }: NFTQRCodeProps) {
  const [showQR, setShowQR] = useState(false);

  // Create verification URL for the QR code
  const verificationUrl = `${window.location.origin}/?verify=${contractAddress}&token=${tokenId}`;
  const shareText = `Verify this luxury NFT: ${nftName || `Token #${tokenId}`}`;

  const downloadQR = () => {
    const svg = document.querySelector('#nft-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `luxlink-nft-${tokenId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: `Verify this luxury NFT on LuxLink`,
          url: verificationUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(verificationUrl);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(verificationUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  if (!showQR) {
    return (
      <Button
        onClick={() => setShowQR(true)}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <QrCode className="w-4 h-4" />
        <span>Generate QR Code</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">NFT QR Code</h3>
          <button
            onClick={() => setShowQR(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-white p-4 rounded-lg inline-block">
            <QRCode
              id="nft-qr-code"
              value={verificationUrl}
              size={200}
              level="M"
            />
          </div>

          <div>
            <p className="text-sm text-gray-300 mb-2">
              Scan to verify this NFT on any device
            </p>
            <p className="text-xs text-gray-500 break-all">
              {verificationUrl}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={downloadQR}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-black text-sm py-2 flex items-center justify-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
            <Button
              onClick={shareQR}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 flex items-center justify-center space-x-1"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}