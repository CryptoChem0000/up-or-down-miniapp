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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Mini App Container - 424x695 */}
      <div 
        className="w-[424px] h-[695px] bg-background border border-border/20 rounded-2xl overflow-hidden"
        style={{ 
          boxShadow: "0 20px 60px -12px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div className="h-full flex flex-col p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ETH</span>
              </div>
              <h1 className="text-xl font-bold">Daily ETH Poll</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Will ETH price go up or down today?
            </p>
            {!hasVoted && (
              <Badge variant="outline" className="border-primary text-primary">
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
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Make Your Prediction</h2>
              {hasVoted && (
                <Badge variant="outline" className="border-success text-success bg-success/10">
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
            <Card className="p-3 bg-muted/20 border-border/30">
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div>Build your streak • Compete with others</div>
                <div className="text-primary">Results revealed daily at 12:01 AM UTC</div>
                <div className="flex gap-2 justify-center mt-2">
                  <a href="/api/frames" className="text-primary hover:underline">Frame →</a>
                  <a href="/test" className="text-primary hover:underline">Test Panel →</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
