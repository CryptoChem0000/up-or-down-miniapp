"use client";

import React, { useState } from "react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Flame, Users, Trophy, X, Crown } from "lucide-react";
import Link from "next/link";
import * as ToastPrimitives from "@radix-ui/react-toast";
import HeroHeader from "@/components/HeroHeader";
import { useMyStats } from "@/hooks/useMyStats";
import { useResultToast } from "@/hooks/useResultToast";
import { useToast } from "@/hooks/use-toast";
import { useHapticFeedback } from "@/hooks/useCapabilities";
import { isVotingOpen, getVotingWindowMessage } from "@/lib/vote-window";
import { 
  ToastProvider, 
  ToastViewport, 
  Toast, 
  ToastTitle, 
  ToastDescription, 
  ToastClose 
} from "@/components/ui/toast";

/** utils */
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/** Button */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
); Button.displayName = "Button";

/** Card */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
); Card.displayName = "Card";

/** Badge */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  { variants: { variant: {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    }}, defaultVariants: { variant: "default" } }
);
function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Toast components */
function Toaster(){ const { toasts } = useToast(); return (<ToastProvider>{toasts.map(({ id, title, description, ...props }) => (<Toast key={id} {...props}><div className="grid gap-1">{title && <ToastTitle>{title}</ToastTitle>}{description && <ToastDescription>{description}</ToastDescription>}</div><ToastClose/></Toast>))}<ToastViewport/></ToastProvider>); }

/** UI bits */
interface VoteButtonProps { direction: "up" | "down"; onClick: () => void; isSelected?: boolean; className?: string; }
const VoteButton = ({ direction, onClick, isSelected, className }: VoteButtonProps) => {
  const isUp = direction === "up";
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-14 text-base font-bold transition-all duration-300 relative overflow-hidden group",
        "border-2 hover:scale-105 active:scale-95",
        isUp ? "bg-green-500 border-green-500 text-white hover:bg-green-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/25"
             : "bg-red-500 border-red-500 text-white hover:bg-red-500 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/25",
        isSelected && "ring-2 ring-white/30 shadow-xl",
        className
      )}
      size="lg"
    >
      <div className="flex items-center gap-2 relative z-10">
        {isUp ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
        <span>{isUp ? "UP" : "DOWN"}</span>
      </div>
    </Button>
  );
};

interface ETHPriceDisplayProps { price: number; change24h: number; changePercent: number; }
const ETHPriceDisplay = ({ price, change24h, changePercent }: ETHPriceDisplayProps) => {
  const positive = change24h >= 0;
  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-400 font-medium">Current ETH Price</div>
        <div className="text-2xl font-bold text-white">${price.toLocaleString()}</div>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium border-2", positive ? "border-green-500 text-green-400 bg-green-500/10" : "border-red-500 text-red-400 bg-red-500/10")}>
            <div className="flex items-center gap-1">
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{positive ? "+" : ""}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          <span className={cn("text-xs font-medium", positive ? "text-green-400" : "text-red-400")}>
            {positive ? "+" : ""}${change24h.toFixed(2)}
          </span>
        </div>
        <div className="text-[10px] text-gray-400">24h change</div>
      </div>
    </Card>
  );
};

interface StatsCardProps { streak: number; totalVotes: number; accuracy: number; points?: number; fidParam?: string; }
const StatsCard = ({ streak, totalVotes, accuracy, points, fidParam = "" }: StatsCardProps) => (
  <Card className="p-4 bg-gray-800 border-gray-700">
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-lg font-bold text-orange-400">{streak}</span>
        </div>
        <div className="text-xs text-gray-400">Streak</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-lg font-bold text-blue-400">{accuracy}%</span>
        </div>
        <div className="text-xs text-gray-400">Accuracy</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Trophy className="w-4 h-4 text-green-400" />
          <span className="text-lg font-bold text-green-400">{points ? points.toLocaleString() : '0'}</span>
        </div>
        <div className="text-xs text-gray-400">Points</div>
      </div>
    </div>

    <Button
      asChild
      variant="outline"
      className="w-full mt-4 border-primary/20 hover:bg-primary/5 transition-colors text-gray-200 hover:text-white"
    >
      <Link href={`/leaderboard?compact=1&fid=${fidParam}`}>
        <Crown className="w-4 h-4 text-primary mr-2" />
        <span className="text-sm font-medium">View Leaderboard</span>
      </Link>
    </Button>
  </Card>
);

/** Helper function to open composer with embed */
function composeWithEmbed(baseHref: string) {
  const embed = encodeURIComponent(baseHref);
  const url = `https://warpcast.com/~/compose?text=&embeds[]=${embed}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Page */
export default function DailyOneTapPoll() {
  // FORCE DEPLOYMENT - ETHEREUM TITLE FIX - $(date)
  const [selectedVote, setSelectedVote] = useState<"up" | "down" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [my, setMy] = useState<{streak:number; points:number; totalVotes?: number; accuracy?: number} | null>(null);
  const [ethData, setEthData] = useState<{price: number; change24h: number; changePercent: number}>({ price: 0, change24h: 0, changePercent: 0 });
  const { toast } = useToast();
  const { triggerImpact, triggerSelection } = useHapticFeedback();
  
  // Check voting window status
  const votingOpen = isVotingOpen();
  const votingMessage = getVotingWindowMessage();
  
  // Get real user stats
  const { data: myStats, loading: myStatsLoading } = useMyStats();

  // Show result toast for yesterday's outcome
  useResultToast();

  // Establish session cookie on page load (fire and forget)
  React.useEffect(() => {
    // This will set the HttpOnly cookie if the request is signed
    fetch("/api/auth/establish", { method: "POST", cache: "no-store" }).catch(() => {});
  }, []);


  // Show dev links only in development
  const SHOW_DEV_LINKS = 
    process.env.NEXT_PUBLIC_SHOW_DEV_LINKS === "true" &&
    process.env.NODE_ENV !== "production";

  // Load personal stats if fid is in URL (legacy support)
  React.useEffect(() => {
    const fid = new URL(window.location.href).searchParams.get("fid");
    if (!fid) return;
    fetch(`/api/user/${fid}`).then(r => r.json()).then(setMy).catch(() => {});
  }, []);

  // Get FID for leaderboard link
  const [fidParam, setFidParam] = React.useState("");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const fid = new URL(window.location.href).searchParams.get("fid") || "";
      setFidParam(fid);
    }
  }, []);

  // Price fetching with recommended refresh policy
  React.useEffect(() => {
    const loadPrice = async () => {
      try {
        const response = await fetch("/api/price", { cache: "no-store" });
        const data = await response.json();
        if (data.price) {
          // Use real price data - change data will be calculated from historical prices
          setEthData({
            price: data.price,
            change24h: data.change24h || 0, // Real data when available
            changePercent: data.changePercent || 0 // Real data when available
          });
        }
      } catch (error) {
        console.error("Failed to fetch price:", error);
      }
    };

    // Initial load
    loadPrice();

    // Refresh on tab focus
    const onFocus = () => {
      if (document.visibilityState === "visible") {
        loadPrice();
      }
    };
    window.addEventListener("visibilitychange", onFocus);

    // Poll every 2 minutes (120 seconds)
    const intervalId = setInterval(loadPrice, 120_000);

    return () => {
      window.removeEventListener("visibilitychange", onFocus);
      clearInterval(intervalId);
    };
  }, []);

  const userStats = { 
    streak: myStats?.ok ? (myStats.stats?.currentStreak ?? 0) : (my?.streak ?? 0), 
    totalVotes: myStats?.ok ? (myStats.stats?.totalVotes ?? 0) : (my?.totalVotes ?? 0), 
    accuracy: myStats?.ok ? (myStats.accuracy ?? 0) : (my?.accuracy ?? 0),
    points: myStats?.ok ? (myStats.stats?.totalPoints ?? 0) : (my?.points ?? 0),
    todayVote: myStats?.ok ? myStats.todayVote : null
  };

  async function handleVote(dir: "up" | "down") {
    if (hasVoted) return;
    
    if (!votingOpen) {
      toast({ title: "Vote is Closed", description: "Vote resets at 12:01 AM UTC. Check back in tomorrow to log your vote!" });
      return;
    }
    
    // Trigger haptic feedback on vote selection
    await triggerSelection();
    
    setSelectedVote(dir);
    
    try {
      // Make the actual API call to record the vote
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookies
        body: JSON.stringify({ direction: dir }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "already_voted") {
          toast({ 
            title: "Already Voted", 
            description: "You've already made your prediction for today. Check back tomorrow!",
            variant: "destructive"
          });
          return;
        } else if (result.error === "voting_closed") {
          toast({ 
            title: "Voting Closed", 
            description: "Vote resets at 12:01 AM UTC. Check back in tomorrow!",
            variant: "destructive"
          });
          return;
        } else {
          throw new Error(result.error || "Vote failed");
        }
      }

      // Vote was successful
      setHasVoted(true);
      
      // Trigger haptic feedback on successful vote
      await triggerImpact('medium');
      
      toast({ 
        title: `Voted ${dir.toUpperCase()}!`, 
        description: "Your prediction has been recorded. Check back tomorrow for results!\nResults revealed daily at 12:01 AM UTC" 
      });

    } catch (error) {
      console.error("Vote error:", error);
      
      // Reset the selection on error
      setSelectedVote(null);
      
      // Check if this might be an "already voted" scenario
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
        // Fetch the actual vote from the server to show correct direction
        try {
          const statsResponse = await fetch("/api/stats/me", {
            credentials: "include", // Include session cookies
          });
          const statsData = await statsResponse.json();
          const actualVote = statsData.ok && statsData.todayVote ? statsData.todayVote : dir;
          toast({ 
            title: "Already Voted", 
            description: `You've already voted ${actualVote.toUpperCase()} today. Check back tomorrow to see the results!`,
            variant: "default"
          });
        } catch (statsError) {
          // Fallback to button direction if stats fetch fails
          toast({ 
            title: "Already Voted", 
            description: `You've already voted ${dir.toUpperCase()} today. Check back tomorrow to see the results!`,
            variant: "default"
          });
        }
      } else {
        toast({ 
          title: "Vote Failed", 
          description: "Failed to record your vote. Please try again.",
          variant: "destructive"
        });
      }
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-[424px] h-[695px] bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 60px -12px rgba(0,0,0,0.8)" }}>
          <div className="h-full flex flex-col p-6 space-y-6">
            <HeroHeader
              iconSrc="/eth-mark-tight-20.png"
              title="Ethereum"
              subtitle="Will ETH price go up or down today?"
            />

            <ETHPriceDisplay price={ethData.price} change24h={ethData.change24h} changePercent={ethData.changePercent} />

            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-base font-semibold mb-2 text-white">Make Your Prediction</h2>
                {hasVoted && <Badge variant="outline" className="border-green-500 text-green-400">Voted {selectedVote?.toUpperCase()} ✓</Badge>}
                {!hasVoted && !votingOpen && <Badge variant="outline" className="border-red-500 text-red-400">Vote is Closed</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <VoteButton direction="up" onClick={() => handleVote("up")} isSelected={selectedVote === "up"} className={hasVoted && selectedVote !== "up" ? "opacity-50" : !votingOpen ? "opacity-50 cursor-not-allowed" : ""} />
                <VoteButton direction="down" onClick={() => handleVote("down")} isSelected={selectedVote === "down"} className={hasVoted && selectedVote !== "down" ? "opacity-50" : !votingOpen ? "opacity-50 cursor-not-allowed" : ""} />
              </div>
            </div>

            <StatsCard streak={userStats.streak} totalVotes={userStats.totalVotes} accuracy={userStats.accuracy} points={userStats.points} fidParam={fidParam} />

            <div className="mt-auto">
              <Card className="p-3 bg-gray-800 border-gray-700">
                <div className="text-xs text-gray-400 text-center space-y-2">
                  <div>Build your streak • Compete with others</div>
                  {!hasVoted && (
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {votingMessage}
                    </div>
                  )}

                  {SHOW_DEV_LINKS && (
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => composeWithEmbed(window.location.origin)}
                        className="border-primary text-primary hover:text-white hover:border-primary/80"
                      >
                        Compose (embed)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open("/api/frames", "_blank")}
                        className="text-gray-200"
                      >
                        Open Frame
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}

// Components are defined above for use within this page
// If you need to reuse them elsewhere, move them to separate files
