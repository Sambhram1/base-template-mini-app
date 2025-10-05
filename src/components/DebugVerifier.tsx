"use client";

import { useState } from "react";
import { useVerifyNFT, useTokenURI, useProductDetails } from "~/contracts/LuxLinkNFT";
import { Button } from "~/components/ui/Button";

export function DebugVerifier() {
  const [tokenId, setTokenId] = useState("1");
  
  const { 
    data: verificationData, 
    isLoading: isVerificationLoading,
    error: verificationError,
    isSuccess: verificationSuccess
  } = useVerifyNFT(tokenId);
  
  const { 
    data: tokenURI,
    isLoading: isURILoading,
    error: uriError
  } = useTokenURI(tokenId);
  
  const { 
    data: productDetails,
    isLoading: isProductLoading,
    error: productError
  } = useProductDetails(tokenId);

  return (
    <div className="p-6 space-y-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white">Debug NFT Verification</h3>
      
      <div>
        <label className="block text-sm text-gray-300 mb-2">Token ID:</label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded"
          placeholder="Enter token ID (1, 2, etc.)"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-700 p-4 rounded">
          <h4 className="font-semibold text-white mb-2">Verification Data:</h4>
          <div className="text-sm text-gray-300">
            <p>Loading: {isVerificationLoading ? 'Yes' : 'No'}</p>
            <p>Success: {verificationSuccess ? 'Yes' : 'No'}</p>
            <p>Error: {verificationError ? verificationError.message : 'None'}</p>
            <p>Data: {verificationData ? JSON.stringify(verificationData) : 'None'}</p>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <h4 className="font-semibold text-white mb-2">Token URI:</h4>
          <div className="text-sm text-gray-300">
            <p>Loading: {isURILoading ? 'Yes' : 'No'}</p>
            <p>Error: {uriError ? uriError.message : 'None'}</p>
            <p>URI: {tokenURI || 'None'}</p>
            {tokenURI && tokenURI.startsWith('data:application/json;base64,') && (
              <div className="mt-2">
                <p>Decoded:</p>
                <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(JSON.parse(atob(tokenURI.replace('data:application/json;base64,', ''))), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded">
          <h4 className="font-semibold text-white mb-2">Product Details:</h4>
          <div className="text-sm text-gray-300">
            <p>Loading: {isProductLoading ? 'Yes' : 'No'}</p>
            <p>Error: {productError ? productError.message : 'None'}</p>
            <p>Data: {productDetails ? JSON.stringify(productDetails) : 'None'}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          // Force refetch by changing token ID
          const current = tokenId;
          setTokenId('');
          setTimeout(() => setTokenId(current), 100);
        }}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Refresh Data
      </Button>
    </div>
  );
}