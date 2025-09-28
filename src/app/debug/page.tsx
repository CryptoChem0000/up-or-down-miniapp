"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [manifest, setManifest] = useState<any>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      addLog("🔍 Starting Farcaster Mini App Debug Tests...");
      
      // Test 1: Check if we're in an iframe
      const inIframe = typeof window !== "undefined" && window.parent !== window;
      addLog(`📱 In iframe: ${inIframe}`);
      
      // Test 2: Check manifest
      try {
        const response = await fetch('/.well-known/farcaster.json');
        const manifestData = await response.json();
        setManifest(manifestData);
        addLog(`📄 Manifest loaded: ${JSON.stringify(manifestData, null, 2)}`);
      } catch (error) {
        addLog(`❌ Manifest error: ${error}`);
      }
      
      // Test 3: Try SDK import
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        addLog(`📦 SDK imported successfully`);
        addLog(`🔧 SDK methods: ${Object.keys(sdk.actions || {}).join(', ')}`);
        
        // Test 4: Try ready() call
        if (inIframe) {
          try {
            addLog(`🚀 Calling sdk.actions.ready()...`);
            await sdk.actions.ready();
            addLog(`✅ SDK ready() called successfully`);
          } catch (readyError) {
            addLog(`❌ SDK ready() failed: ${readyError}`);
          }
        }
        
        // Test 5: Try context
        try {
          const context = await sdk.context;
          addLog(`📱 Context: ${JSON.stringify(context, null, 2)}`);
        } catch (contextError) {
          addLog(`❌ Context error: ${contextError}`);
        }
        
      } catch (sdkError) {
        addLog(`❌ SDK import failed: ${sdkError}`);
      }
      
      // Test 6: Check window properties
      addLog(`🌐 Window parent: ${window.parent !== window}`);
      addLog(`🌐 Window location: ${window.location.href}`);
      addLog(`🌐 User agent: ${navigator.userAgent}`);
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Farcaster Mini App Debug</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Debug Logs</h2>
          <div className="bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Manifest Data</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="text-sm font-mono overflow-x-auto">
              {manifest ? JSON.stringify(manifest, null, 2) : 'Loading...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
