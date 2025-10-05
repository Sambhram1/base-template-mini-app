"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useVerifyNFT } from '~/contracts/LuxLinkNFT';

interface QRCameraScannerProps {
  onScanSuccess: (tokenId: string) => void;
  onClose: () => void;
}

export function QRCameraScanner({ onScanSuccess, onClose }: QRCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setError('');
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const simulateScan = () => {
    setScanning(true);
    
    // Simulate QR code detection after 2 seconds
    setTimeout(() => {
      // For demo purposes, simulate finding a token ID
      const mockTokenIds = ['1', '2', '3', '4', '5'];
      const randomTokenId = mockTokenIds[Math.floor(Math.random() * mockTokenIds.length)];
      setScanResult(randomTokenId);
      setScanning(false);
      
      // Trigger success callback
      setTimeout(() => {
        onScanSuccess(randomTokenId);
      }, 1000);
    }, 2000);
  };

  const manualInput = () => {
    const tokenId = prompt('Enter Token ID to verify:');
    if (tokenId && tokenId.trim()) {
      onScanSuccess(tokenId.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <h2 className="text-white font-semibold">Scan QR Code</h2>
        <Button
          onClick={onClose}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 w-10 h-10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-white mb-4">{error}</p>
              <Button onClick={startCamera}>Try Again</Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanning Frame */}
                <div className="w-64 h-64 border-2 border-gold-500 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-500"></div>
                  
                  {/* Scanning Animation */}
                  {scanning && (
                    <div className="absolute inset-0 bg-gold-500/20 animate-pulse"></div>
                  )}
                  
                  {/* Success Animation */}
                  {scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                      <CheckCircle className="w-16 h-16 text-green-400" />
                    </div>
                  )}
                </div>
                
                <p className="text-white text-center mt-4">
                  {scanning ? 'Scanning...' : scanResult ? `Found Token: ${scanResult}` : 'Position QR code in the frame'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-900 space-y-4">
        {!scanning && !scanResult && (
          <>
            <Button
              onClick={simulateScan}
              className="w-full bg-gold-600 hover:bg-gold-700 text-black font-semibold py-3"
              disabled={!!error}
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
            
            <Button
              onClick={manualInput}
              className="w-full bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Enter Token ID Manually
            </Button>
          </>
        )}

        {scanning && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Scanning for QR code...</p>
          </div>
        )}

        {scanResult && (
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 text-sm">QR Code detected! Verifying...</p>
          </div>
        )}
      </div>
    </div>
  );
}