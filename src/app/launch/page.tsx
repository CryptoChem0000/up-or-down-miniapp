"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LaunchPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page immediately
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Launching app...</p>
      </div>
    </div>
  );
}
