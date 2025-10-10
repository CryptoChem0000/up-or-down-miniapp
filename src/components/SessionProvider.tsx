"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SessionCtx = {
  sessionReady: boolean;
  fid?: number | null;
  username?: string | null;
};

const SessionContext = createContext<SessionCtx>({ sessionReady: false });
export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log("🚀 SessionProvider: Initializing...");
        
        // Wait for SessionBootstrap to complete
        const started = Date.now();
        while (!(window as any).__sessionReady && Date.now() - started < 5000) {
          await new Promise(r => setTimeout(r, 100));
        }
        
        if (!cancelled) {
          setSessionReady(true);
          console.log("✅ SessionProvider: Session ready");
        }
      } catch (error) {
        console.error("❌ SessionProvider: Error during initialization:", error);
        if (!cancelled) {
          setSessionReady(true); // Set ready even on error to prevent infinite loading
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      sessionReady,
      fid,
      username,
    }),
    [sessionReady, fid, username]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}