"use client";
import { useState, useEffect } from "react";

interface Capabilities {
  chains: string[];
  capabilities: string[];
  supportsCompose: boolean;
  supportsWallet: boolean;
  supportsHaptics: {
    impact: boolean;
    notification: boolean;
    selection: boolean;
  };
  isEthereumSupported: boolean;
  isBaseSupported: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useCapabilities(): Capabilities {
  const [state, setState] = useState<Capabilities>({
    chains: [],
    capabilities: [],
    supportsCompose: false,
    supportsWallet: false,
    supportsHaptics: {
      impact: false,
      notification: false,
      selection: false,
    },
    isEthereumSupported: false,
    isBaseSupported: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function detectCapabilities() {
      try {
        console.log("🔍 useCapabilities: Starting detection...");
        
        // Check if we're in an iframe context first
        if (typeof window === 'undefined' || window === window.parent) {
          console.log("🔍 useCapabilities: Not in iframe, skipping SDK calls");
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Not in iframe context",
          }));
          return;
        }
        
        // Dynamically import SDK to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Get supported chains
        const chains = await sdk.getChains();
        
        // Get supported capabilities
        const capabilities = await sdk.getCapabilities();
        
        // Check for specific capabilities
        const supportsCompose = capabilities.includes('actions.composeCast');
        const supportsWallet = capabilities.includes('wallet.getEthereumProvider');
        
        // Check for haptics support
        const supportsHaptics = {
          impact: capabilities.includes('haptics.impactOccurred'),
          notification: capabilities.includes('haptics.notificationOccurred'),
          selection: capabilities.includes('haptics.selectionChanged'),
        };
        
        // Check for specific chain support
        const isEthereumSupported = chains.includes('eip155:1');
        const isBaseSupported = chains.includes('eip155:8453');
        
        setState({
          chains,
          capabilities,
          supportsCompose,
          supportsWallet,
          supportsHaptics,
          isEthereumSupported,
          isBaseSupported,
          isLoading: false,
          error: null,
        });
        
        console.log("✅ useCapabilities: Detection complete", {
          chains,
          isEthereumSupported,
          isBaseSupported,
          supportsCompose,
          supportsWallet,
          supportsHaptics,
        });
        
      } catch (err) {
        console.error("❌ useCapabilities: Detection failed", err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    }

    detectCapabilities();
  }, []);

  return state;
}

// Utility functions for common capability checks
export function useHapticFeedback() {
  const { supportsHaptics, isLoading } = useCapabilities();
  
  const triggerImpact = async (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (supportsHaptics.impact && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.impactOccurred(intensity);
        console.log(`📳 Haptic feedback triggered: ${intensity}`);
      } catch (err) {
        console.error("❌ Haptic feedback failed:", err);
      }
    }
  };
  
  const triggerNotification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (supportsHaptics.notification && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.notificationOccurred(type);
        console.log(`📳 Notification haptic triggered: ${type}`);
      } catch (err) {
        console.error("❌ Notification haptic failed:", err);
      }
    }
  };
  
  const triggerSelection = async () => {
    if (supportsHaptics.selection && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.selectionChanged();
        console.log("📳 Selection haptic triggered");
      } catch (err) {
        console.error("❌ Selection haptic failed:", err);
      }
    }
  };
  
  return {
    supportsHaptics,
    isLoading,
    triggerImpact,
    triggerNotification,
    triggerSelection,
  };
}

// Hook for wallet capabilities
export function useWalletCapabilities() {
  const { supportsWallet, isEthereumSupported, isBaseSupported, isLoading } = useCapabilities();
  
  return {
    supportsWallet,
    isEthereumSupported,
    isBaseSupported,
    isLoading,
    canConnectWallet: supportsWallet && (isEthereumSupported || isBaseSupported),
  };
}
