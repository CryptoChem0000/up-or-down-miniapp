"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface DetectionResults {
  chains: string[];
  capabilities: string[];
  supportsCompose: boolean;
  supportsWallet: boolean;
  supportsHaptics: {
    impact: boolean;
    notification: boolean;
    selection: boolean;
  };
}

export default function RuntimeDetection() {
  // Temporarily disabled to fix Farcaster connection issue
  // const [detectionResults, setDetectionResults] = useState<DetectionResults | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function detectCapabilities() {
  //     try {
  //       console.log("🔍 Starting runtime detection...");
        
  //       // Get supported chains
  //       const chains = await sdk.getChains();
  //       console.log("🔗 Supported chains:", chains);
        
  //       // Get supported capabilities
  //       const capabilities = await sdk.getCapabilities();
  //       console.log("⚡ Supported capabilities:", capabilities);
        
  //       // Check for specific capabilities
  //       const supportsCompose = capabilities.includes('actions.composeCast');
  //       const supportsWallet = capabilities.includes('wallet.getEthereumProvider');
        
  //       // Check for haptics support
  //       const supportsHaptics = {
  //         impact: capabilities.includes('haptics.impactOccurred'),
  //         notification: capabilities.includes('haptics.notificationOccurred'),
  //         selection: capabilities.includes('haptics.selectionChanged')
  //       };
        
  //       const results: DetectionResults = {
  //         chains,
  //         capabilities,
  //         supportsCompose,
  //         supportsWallet,
  //         supportsHaptics
  //       };
        
  //       setDetectionResults(results);
        
  //       // Log results for debugging
  //       console.log("📊 Detection Results:", {
  //         chains: chains,
  //         supportsEthereum: chains.includes('eip155:1'),
  //         supportsBase: chains.includes('eip155:8453'),
  //         supportsCompose,
  //         supportsWallet,
  //         supportsHaptics
  //       });
        
  //       // Use haptics if supported
  //       if (supportsHaptics.impact) {
  //         console.log("📳 Triggering haptic feedback...");
  //         await sdk.haptics.impactOccurred('medium');
  //       }
        
  //     } catch (err) {
  //       console.error("❌ Runtime detection failed:", err);
  //       setError(err instanceof Error ? err.message : "Unknown error");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   detectCapabilities();
  // }, []);

  // Temporarily disabled to fix Farcaster connection issue
  return null;
  
  // Only show debug info in development
  // if (process.env.NODE_ENV === 'production') {
  //   return null;
  // }

  // if (isLoading) {
  //   return (
  //     <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs">
  //       <div className="flex items-center gap-2">
  //         <div className="animate-spin h-3 w-3 border border-blue-400 border-t-transparent rounded-full"></div>
  //         <span>Detecting capabilities...</span>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="fixed bottom-4 left-4 bg-red-800 text-white p-3 rounded-lg text-xs max-w-xs">
  //       <div className="font-semibold mb-1">❌ Detection Error</div>
  //       <div>{error}</div>
  //     </div>
  //   );
  // }

  // if (!detectionResults) {
  //   return null;
  // }

  // return (
  //   <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs">
  //     <div className="font-semibold mb-2">🔍 Runtime Detection</div>
      
  //     <div className="mb-2">
  //       <div className="font-medium">Chains ({detectionResults.chains.length}):</div>
  //       <div className="flex flex-wrap gap-1 mt-1">
  //         {detectionResults.chains.map(chain => (
  //           <span 
  //             key={chain}
  //             className={`px-2 py-1 rounded text-xs ${
  //               chain === 'eip155:1' || chain === 'eip155:8453' 
  //                 ? 'bg-green-600' 
  //                 : 'bg-gray-600'
  //             }`}
  //           >
  //             {chain === 'eip155:1' ? 'ETH' : chain === 'eip155:8453' ? 'Base' : chain}
  //           </span>
  //         ))}
  //       </div>
  //     </div>
      
  //     <div className="mb-2">
  //       <div className="font-medium">Capabilities:</div>
  //       <div className="flex flex-wrap gap-1 mt-1">
  //         {detectionResults.supportsCompose && (
  //           <span className="px-2 py-1 rounded text-xs bg-blue-600">Compose</span>
  //         )}
  //         {detectionResults.supportsWallet && (
  //           <span className="px-2 py-1 rounded text-xs bg-purple-600">Wallet</span>
  //         )}
  //         {(detectionResults.supportsHaptics.impact || 
  //           detectionResults.supportsHaptics.notification || 
  //           detectionResults.supportsHaptics.selection) && (
  //           <span className="px-2 py-1 rounded text-xs bg-orange-600">Haptics</span>
  //         )}
  //       </div>
  //     </div>
      
  //     <div className="text-gray-400 text-xs">
  //       Total: {detectionResults.capabilities.length} capabilities
  //     </div>
  //   </div>
  // );
}
