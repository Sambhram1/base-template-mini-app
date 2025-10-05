"use client";

import { useState, useRef } from "react";
import { Button } from "~/components/ui/Button";
import { NFTVerifier } from "~/components/NFTVerifier";
import { Camera, Scan, Upload, CheckCircle, XCircle } from "lucide-react";

export function QRScanner() {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would process the QR code from the uploaded image
      console.log("Processing QR from uploaded file:", file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold-500 mb-2">
            💎 LuxLink
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">
            Verify Luxury NFTs
          </h2>
          <p className="text-gray-400">
            Scan QR codes to verify authentic luxury products
          </p>
        </div>

        {/* Scan Mode Selection */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-gold-500 mb-4 text-center">
            How do you want to scan?
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Camera Scan */}
            <Button
              onClick={() => {
                setScanMode('camera');
                setIsScanning(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl h-auto"
            >
              <div className="flex items-center space-x-3">
                <Camera className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Use Camera</div>
                  <div className="text-sm opacity-90">Scan QR code with your camera</div>
                </div>
              </div>
            </Button>

            {/* Upload Image */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl h-auto"
            >
              <div className="flex items-center space-x-3">
                <Upload className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Upload Image</div>
                  <div className="text-sm opacity-90">Upload a photo of the QR code</div>
                </div>
              </div>
            </Button>

            {/* Manual Entry */}
            <Button
              onClick={() => setScanMode('manual')}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl h-auto"
            >
              <div className="flex items-center space-x-3">
                <Scan className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Manual Entry</div>
                  <div className="text-sm opacity-90">Enter NFT details manually</div>
                </div>
              </div>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Scanner Interface */}
        {(isScanning || scanMode !== 'camera') && (
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6">
            {scanMode === 'camera' && isScanning && (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-64 h-64 mx-auto bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Camera will open here</p>
                      <p className="text-gray-500 text-xs mt-1">Point at QR code to scan</p>
                    </div>
                  </div>
                  
                  {/* Scanning Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-gold-500 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-gold-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-gold-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-gold-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-gold-500"></div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsScanning(false)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Stop Scanning
                </Button>
              </div>
            )}

            {scanMode === 'manual' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gold-500 text-center mb-4">
                  Manual NFT Verification
                </h4>
                <NFTVerifier onNFTVerified={(nft) => {
                  console.log("NFT verified:", nft);
                }} />
              </div>
            )}
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Verifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-white text-sm">Rolex Submariner</div>
                  <div className="text-xs text-gray-400">2 minutes ago</div>
                </div>
              </div>
              <div className="text-green-400 text-sm font-medium">Verified ✓</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-medium text-white text-sm">Gucci Handbag</div>
                  <div className="text-xs text-gray-400">1 hour ago</div>
                </div>
              </div>
              <div className="text-red-400 text-sm font-medium">Invalid ✗</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-xl p-4">
          <h4 className="font-semibold text-gold-500 mb-2">How to Verify</h4>
          <ol className="text-xs text-gray-300 space-y-1">
            <li>1. Choose your preferred scanning method above</li>
            <li>2. Point camera at the QR code or upload an image</li>
            <li>3. Wait for automatic verification</li>
            <li>4. View authenticity results instantly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}