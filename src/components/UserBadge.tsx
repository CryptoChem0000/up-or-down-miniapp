"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function UserBadge() {
  const [me, setMe] = useState<{ 
    ok?: boolean;
    username?: string; 
    displayName?: string; 
    avatar?: string 
  } | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/me", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setMe(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    })();
  }, []);

  if (!me?.ok) return null;
  const name = me.displayName || me.username || "You";

  return (
    <div className="flex items-center gap-2 text-sm">
      {me.avatar ? (
        <Image 
          src={me.avatar} 
          alt="" 
          width={20} 
          height={20} 
          className="rounded-full" 
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-muted" />
      )}
      <span className="text-muted-foreground">Signed in as</span>
      <span className="font-medium">{name}</span>
    </div>
  );
}
