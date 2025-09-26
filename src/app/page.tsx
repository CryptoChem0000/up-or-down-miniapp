"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { ETHPriceDisplay } from "@/components/ETHPriceDisplay";
import { StatsCard } from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [selectedVote, setSelectedVote] = useState<"up" | "down" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();
  
  // Mock data - in real app this would come from API
  const ethData = {
    price: 3420.50,
    change24h: 127.32,
    changePercent: 3.87
  };
  
  const userStats = {
    streak: 7,
    totalVotes: 23,
    accuracy: 74
  };

  const handleVote = (direction: "up" | "down") => {
    if (hasVoted) return;
    
    setSelectedVote(direction);
    setHasVoted(true);
    
    toast({
      title: `Voted ${direction.toUpperCase()}!`,
      description: "Your prediction has been recorded. Check back tomorrow for results!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Mini App Container - 424x695 */}
      <div 
        className="w-[424px] h-[695px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden relative"
        style={{ 
          boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative h-full flex flex-col p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-sm">ETH</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Daily ETH Poll
              </h1>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Will ETH price go up or down today?
            </p>
            {!hasVoted && (
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 backdrop-blur-sm">
                Vote closes at midnight UTC
              </Badge>
            )}
          </div>

          {/* ETH Price Display */}
          <ETHPriceDisplay 
            price={ethData.price}
            change24h={ethData.change24h}
            changePercent={ethData.changePercent}
          />

          {/* Voting Section */}
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-3 text-white">Make Your Prediction</h2>
              {hasVoted && (
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 backdrop-blur-sm">
                  Voted {selectedVote?.toUpperCase()} ✓
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <VoteButton
                direction="up"
                onClick={() => handleVote("up")}
                isSelected={selectedVote === "up"}
                className={hasVoted && selectedVote !== "up" ? "opacity-50" : ""}
              />
              <VoteButton
                direction="down"
                onClick={() => handleVote("down")}
                isSelected={selectedVote === "down"}
                className={hasVoted && selectedVote !== "down" ? "opacity-50" : ""}
              />
            </div>
          </div>

          {/* Stats */}
          <StatsCard 
            streak={userStats.streak}
            totalVotes={userStats.totalVotes}
            accuracy={userStats.accuracy}
          />

          {/* Footer Info */}
          <div className="mt-auto">
            <Card className="p-4 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <div className="text-xs text-slate-400 text-center space-y-2">
                <div className="text-slate-300">Build your streak • Compete with others</div>
                <div className="text-blue-400 font-medium">Results revealed daily at 12:01 AM UTC</div>
                <div className="flex gap-3 justify-center mt-3">
                  <a href="/api/frames" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline">
                    Frame →
                  </a>
                  <a href="/test" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline">
                    Test Panel →
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
