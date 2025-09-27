"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Crown, Medal, Award, ArrowLeft, User, Flame, Users } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// Utility function for class merging
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// Button component (copied from main page.tsx)
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

// Card components (copied from main page.tsx)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
); Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
); CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
); CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
); CardContent.displayName = "CardContent";

// Badge component (copied from main page.tsx)
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

// Separator component
const Separator = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("shrink-0 bg-border", "h-[1px] w-full", className)} {...props} />
);

// Temporary mock data; swap for API fetch later
const mockLeaderboardData = [
  { id: 1, name: "alice.eth", address: "0x742d35Cc82C0f4C8BD45c4a1b2c3d4e5f6a7b8c9d0e1f2", currentStreak: 25, accuracy: 94, totalPoints: 285, rank: 1 },
  { id: 2, name: "0x8ba1f109551bD432803012b06f3C8a7e3c2a9f", address: "0x8ba1f109551bD432803012b06f3C8a7e3c2a9f1b2c3d4e5f6", currentStreak: 18, accuracy: 91, totalPoints: 234, rank: 2 },
  { id: 3, name: "bob.crypto", address: "0x1f2f377d891b5c2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8", currentStreak: 22, accuracy: 88, totalPoints: 218, rank: 3 },
  { id: 4, name: "0x9d4a1c2b3e5f4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", address: "0x9d4a1c2b3e5f4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", currentStreak: 15, accuracy: 86, totalPoints: 195, rank: 4 },
  { id: 5, name: "trader.defi", address: "0x3c8b7a9e2d1f4e8b9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5", currentStreak: 12, accuracy: 83, totalPoints: 172, rank: 5 },
  { id: 6, name: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0", address: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0", currentStreak: 8, accuracy: 79, totalPoints: 148, rank: 6 },
  { id: 7, name: "crypto.whale", address: "0x4f2e8d1a9b6c3e7f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6", currentStreak: 14, accuracy: 82, totalPoints: 165, rank: 7 },
  { id: 8, name: "0x7e9f3a2b8c1d5e6f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6", address: "0x7e9f3a2b8c1d5e6f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6", currentStreak: 11, accuracy: 78, totalPoints: 142, rank: 8 },
  { id: 9, name: "defi.trader", address: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6", currentStreak: 9, accuracy: 76, totalPoints: 128, rank: 9 },
  { id: 10, name: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", address: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", currentStreak: 7, accuracy: 74, totalPoints: 115, rank: 10 },
];

// Mock current user data - will be replaced with real data from API
const currentUser = {
  name: "You",
  address: "0x1234567890abcdef...1234567890abcdef",
  currentStreak: 7,
  accuracy: 85,
  totalPoints: 124,
  rank: 12
};

function getRankIcon(rank: number) {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Award className="w-5 h-5 text-amber-600" />;
    default: return <Trophy className="w-4 h-4 text-muted-foreground" />;
  }
}

// Utility function to format names and addresses for mobile display
function formatDisplayName(name: string, isCompact: boolean = false): string {
  // If it's a domain name (contains .eth, .crypto, etc.)
  if (name.includes('.eth') || name.includes('.crypto') || name.includes('.wallet')) {
    if (isCompact) {
      return name.length > 12 ? `${name.substring(0, 12)}...` : name;
    }
    return name; // Show full domain names in desktop
  }
  
  // If it's a wallet address (starts with 0x)
  if (name.startsWith('0x')) {
    if (isCompact) {
      return `${name.substring(0, 5)}...${name.substring(name.length - 5)}`;
    }
    return `${name.substring(0, 5)}...${name.substring(name.length - 5)}`;
  }
  
  return name;
}

export default function LeaderboardPage({
  searchParams,
}: {
  searchParams: { compact?: string; fid?: string };
}) {
  const compact = searchParams?.compact === "1";
  const [userStats, setUserStats] = React.useState<{
    streak: number;
    points: number;
    accuracy?: number;
    rank?: number;
  } | null>(null);

  // Fetch real user stats if FID is provided
  React.useEffect(() => {
    const fid = searchParams?.fid;
    if (!fid) return;
    
    fetch(`/api/user/${fid}`)
      .then(r => r.json())
      .then(data => {
        if (data.streak !== undefined && data.points !== undefined) {
          setUserStats(data);
        }
      })
      .catch(() => {
        // Keep using mock data on error
      });
  }, [searchParams?.fid]);

  // Use real user stats if available, otherwise mock data
  const displayUser = userStats ? {
    ...currentUser,
    currentStreak: userStats.streak,
    totalPoints: userStats.points,
    accuracy: userStats.accuracy ?? currentUser.accuracy,
    rank: userStats.rank ?? currentUser.rank,
  } : currentUser;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className={compact ? "mx-auto w-[424px] max-w-full" : "max-w-6xl mx-auto"}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href={compact ? "/?compact=1" : "/"}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <h1 className={compact ? "text-xl font-bold text-white" : "text-3xl font-bold text-white"}>Leaderboard</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className={compact ? "py-3 px-4" : undefined}>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className={compact ? "w-5 h-5 text-primary" : "w-6 h-6 text-primary"} />
              <span className={compact ? "text-base" : ""}>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "px-3 pb-3" : undefined}>
            {!compact ? (
              /* ===== Desktop/table layout ===== */
              <>
                  <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-700/50 rounded-lg mb-4 font-semibold text-sm">
                    <div className="text-gray-300">Rank</div>
                    <div className="text-gray-300">Name</div>
                    <div className="text-center flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="text-center flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-center flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>

                <div className="space-y-2">
                  {mockLeaderboardData.map((u) => (
                    <div
                      key={u.id}
                      className={`grid grid-cols-5 gap-4 py-4 px-4 rounded-lg border transition-colors hover:bg-gray-700/30 ${
                        u.rank <= 3 ? "bg-primary/5 border-primary/20" : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getRankIcon(u.rank)}
                        <span className="font-bold text-white">#{u.rank}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="font-medium text-white">{formatDisplayName(u.name, false)}</span>
                        <span className="text-xs text-gray-400 font-mono">{formatDisplayName(u.address, false)}</span>
                      </div>

                      <div className="text-center">
                        <Badge variant="secondary" className="font-bold bg-orange-500/20 text-orange-400 border-orange-500/30">{u.currentStreak}</Badge>
                      </div>

                      <div className="text-center">
                        <Badge variant={u.accuracy >= 90 ? "default" : "outline"} className="font-bold border-green-500/30 text-green-400 bg-green-500/10">
                          {u.accuracy}%
                        </Badge>
                      </div>

                      <div className="text-center">
                        <span className="text-lg font-bold text-primary">{u.totalPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* ===== Compact/mini-app layout ===== */
              <>
                {/* Compact headers */}
                <div className="flex items-center justify-between gap-3 py-2 px-3 bg-gray-700/50 rounded-lg mb-3 font-semibold text-xs text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="min-w-[44px] text-center">Rank</div>
                    <div>Name</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <Flame className="w-3 h-3 text-orange-400" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Users className="w-3 h-3 text-green-400" />
                    </div>
                    <div className="flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {mockLeaderboardData.map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-700/30 ${
                      u.rank <= 3 ? "bg-primary/5 border-primary/20" : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 min-w-[44px]">
                        {getRankIcon(u.rank)}
                        <span className="font-bold text-sm text-white">#{u.rank}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-white">{formatDisplayName(u.name, true)}</span>
                        <span className="text-xs text-gray-400 font-mono">{formatDisplayName(u.address, true)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-bold text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 border-orange-500/30">{u.currentStreak}</Badge>
                      <Badge variant={u.accuracy >= 90 ? "default" : "outline"} className="font-bold text-xs px-2 py-0.5 border-green-500/30 text-green-400 bg-green-500/10">
                        {u.accuracy}%
                      </Badge>
                      <span className="text-primary font-bold text-sm tabular-nums">
                        {u.totalPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Your Stats Section */}
        <div className="mt-8">
          <Separator className="mb-6 bg-gray-600" />
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className={compact ? "py-3 px-4" : undefined}>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className={compact ? "w-5 h-5 text-primary" : "w-6 h-6 text-primary"} />
                <span className={compact ? "text-base" : ""}>Your Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={compact ? "px-3 pb-3" : undefined}>
              {!compact ? (
                /* ===== Desktop layout ===== */
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-700/50 rounded-lg mb-4 font-semibold text-sm text-gray-300">
                    <div>Rank</div>
                    <div>Name</div>
                    <div className="text-center flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="text-center flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-center flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 py-4 px-4 rounded-lg border bg-card/50 border-primary/30">
                    <div className="flex items-center gap-2">
                      {getRankIcon(displayUser.rank)}
                      <span className="font-bold text-white">#{displayUser.rank}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{formatDisplayName(displayUser.name, false)}</span>
                      <span className="text-xs text-gray-400 font-mono">
                        {formatDisplayName(displayUser.address, false)}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="secondary" className="font-bold bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {displayUser.currentStreak}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <Badge 
                        variant={displayUser.accuracy >= 90 ? "default" : "outline"}
                        className="font-bold border-green-500/30 text-green-400 bg-green-500/10"
                      >
                        {displayUser.accuracy}%
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-bold text-primary">
                        {displayUser.totalPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ===== Compact layout ===== */
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-card/50 border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[44px]">
                      {getRankIcon(displayUser.rank)}
                      <span className="font-bold text-sm text-white">#{displayUser.rank}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-white">{formatDisplayName(displayUser.name, true)}</span>
                      <span className="text-xs text-gray-400 font-mono">{formatDisplayName(displayUser.address, true)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {displayUser.currentStreak}
                    </Badge>
                    <Badge 
                      variant={displayUser.accuracy >= 90 ? "default" : "outline"}
                      className="font-bold text-xs px-2 py-0.5 border-green-500/30 text-green-400 bg-green-500/10"
                    >
                      {displayUser.accuracy}%
                    </Badge>
                    <span className="text-primary font-bold text-sm tabular-nums">
                      {displayUser.totalPoints.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}