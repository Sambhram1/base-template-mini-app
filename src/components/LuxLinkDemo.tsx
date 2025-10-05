"use client";

import { useState } from "react";
import { useMiniApp } from "@neynar/react";

import { QRCameraScanner } from "./QRCameraScanner";
import { AuthorizedMinter } from "./AuthorizedMinter2";
import { useVerifyNFT } from "~/contracts/LuxLinkNFT";
import { Camera, Package, Shield, CheckCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Footer } from "./Footer";

import { Tab } from "~/types/luxlink";
import { APP_NAME } from "~/lib/constants";

export default function LuxLinkDemo({ title = APP_NAME }) {
  const { isSDKLoaded, context } = useMiniApp();
  
  const [activeTab, setActiveTab] = useState<Tab>("scan");
  const [showScanner, setShowScanner] = useState(false);
  const [verifyingTokenId, setVerifyingTokenId] = useState<string>("");
  
  // Only use the hook if we have a valid token ID
  const shouldVerify = verifyingTokenId && 
    verifyingTokenId.trim() !== '' && 
    /^\d+$/.test(verifyingTokenId.trim()) &&
    !verifyingTokenId.includes('http') &&
    !verifyingTokenId.includes('0x');
    
  const { data: verificationResult, isLoading: isVerifying } = useVerifyNFT(shouldVerify ? verifyingTokenId : undefined);

  const handleScanSuccess = (tokenId: string) => {
    setShowScanner(false);
    setVerifyingTokenId(tokenId);
  };

  if (!isSDKLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gold-500 font-semibold">Loading LuxLink...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black text-white"
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 70,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto max-w-md">
        {/* Main Content */}
        <div className="min-h-screen">
          {activeTab === "scan" && !showScanner && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <Shield className="w-20 h-20 text-gold-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gold-500 mb-3">
                  💎 {title}
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  Luxury NFT Authentication
                </p>
              </div>

              <Button
                onClick={() => setShowScanner(true)}
                className="w-full bg-gold-600 hover:bg-gold-700 text-black font-semibold py-4 text-lg"
              >
                <Camera className="w-6 h-6 mr-2" />
                Scan QR Code to Verify
              </Button>

              {/* Debug Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Debug: Manual Token Verification</h3>
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                  <div>
                    <input
                      type="text"
                      value={verifyingTokenId}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numeric values and prevent URLs/addresses
                        if (value === '' || (/^\d+$/.test(value) && !value.includes('http') && !value.includes('0x'))) {
                          setVerifyingTokenId(value);
                        }
                      }}
                      onFocus={(e) => {
                        // Clear invalid data on focus
                        if (verifyingTokenId.includes('0x') || verifyingTokenId.includes('http')) {
                          setVerifyingTokenId('');
                        }
                      }}
                      placeholder="Enter token ID (1, 2, etc.)"
                      className="w-full p-3 bg-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      console.log("Direct contract call button clicked");
                      console.log("Current verifyingTokenId:", verifyingTokenId);
                      
                      // Get token ID - either from input or prompt user
                      let tokenIdToTest = verifyingTokenId;
                      
                      // If input contains contract address or invalid data, prompt for token ID
                      if (!tokenIdToTest || !(/^\d+$/.test(tokenIdToTest.trim())) || tokenIdToTest.includes('0x')) {
                        tokenIdToTest = prompt('Enter Token ID to test (e.g., 1, 2, 3):') || '';
                      }
                      
                      // Validate the token ID
                      if (!tokenIdToTest || !(/^\d+$/.test(tokenIdToTest.trim()))) {
                        alert('Please enter a valid numeric Token ID (e.g., 1, 2, 3)');
                        return;
                      }
                      
                      const cleanTokenId = tokenIdToTest.trim();
                      console.log("Testing with Token ID:", cleanTokenId);
                      
                      try {
                        const { createPublicClient, http } = await import('viem');
                        const { baseSepolia } = await import('viem/chains');
                        
                        console.log("Creating viem client...");
                        const client = createPublicClient({
                          chain: baseSepolia,
                          transport: http('https://sepolia.base.org')
                        });
                        
                        console.log("Making contract call with tokenId:", cleanTokenId);
                        const result = await client.readContract({
                          address: '0x74dba1EE38Db3f03491D6Ccd3dA4Bf7D525FD2D7',
                          abi: [{
                            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
                            "name": "verifyAuthenticity",
                            "outputs": [
                              {"internalType": "bool", "name": "isAuthentic", "type": "bool"},
                              {"internalType": "string", "name": "productId", "type": "string"},
                              {"internalType": "address", "name": "manufacturer", "type": "address"},
                              {"internalType": "string", "name": "brandName", "type": "string"}
                            ],
                            "stateMutability": "view",
                            "type": "function"
                          }],
                          functionName: 'verifyAuthenticity',
                          args: [BigInt(cleanTokenId)]
                        });
                        
                        console.log("Direct contract call result:", result);
                        
                        // Display detailed result
                        const resultMsg = `✅ Direct Contract Call Success!
                        
Token ID: ${cleanTokenId}
IsAuthentic: ${result[0]}
Product ID: ${result[1] || 'N/A'}
Manufacturer: ${result[2] || 'N/A'}
Brand Name: ${result[3] || 'N/A'}`;
                        
                        alert(resultMsg);
                        
                        // Also update the input with the working token ID
                        setVerifyingTokenId(cleanTokenId);
                        
                      } catch (error) {
                        console.error("Direct contract call failed:", error);
                        
                        let errorMsg = 'Unknown error';
                        if (error instanceof Error) {
                          errorMsg = error.message;
                        }
                        
                        alert(`❌ Direct Contract Call Failed:
                        
Error: ${errorMsg}
                        
This might mean:
- Token ID ${cleanTokenId} doesn't exist
- Network connection issue
- Contract not found
                        
Try with Token ID 1 or 2 (known to exist)`);
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Test Direct Contract Call
                  </Button>
                  
                  {/* Quick Test Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => setVerifyingTokenId('1')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                    >
                      Test Token 1
                    </Button>
                    <Button
                      onClick={() => setVerifyingTokenId('2')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                    >
                      Test Token 2
                    </Button>
                  </div>
                </div>
              </div>

              {verifyingTokenId && (
                <div className="bg-gray-800 p-6 rounded-xl space-y-4">
                  <h3 className="text-lg font-semibold text-white">Verification Result</h3>
                  
                  {isVerifying ? (
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-400">Verifying Token ID: {verifyingTokenId}</p>
                    </div>
                  ) : verificationResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-green-400 font-semibold">
                          {verificationResult[0] ? 'AUTHENTIC' : 'NOT AUTHENTIC'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Token ID:</p>
                          <p className="text-white">{verifyingTokenId}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Product ID:</p>
                          <p className="text-white">{verificationResult[1] || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Manufacturer:</p>
                          <p className="text-white">{verificationResult[2]?.slice(0, 10)}...</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Brand:</p>
                          <p className="text-white">{verificationResult[3] || 'N/A'}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setVerifyingTokenId("")}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        Scan Another NFT
                      </Button>
                    </div>
                  ) : (
                    <p className="text-red-400">Failed to verify token</p>
                  )}
                </div>
              )}
            </div>
          )}

          {showScanner && (
            <QRCameraScanner
              onScanSuccess={handleScanSuccess}
              onClose={() => setShowScanner(false)}
            />
          )}

          {activeTab === "mint" && <AuthorizedMinter />}
        </div>

        {/* Bottom Navigation */}
        <Footer
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}