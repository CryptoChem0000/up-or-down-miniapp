"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Crown, Medal, Award, ArrowLeft, User, Flame, Users } from "lucide-react";
import { useMyStats } from "@/hooks/useMyStats";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { LeaderboardRow } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// Custom Tooltip component for better mobile support
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

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
    case 1: return <Crown className="w-3 h-3 text-yellow-500" />;
    case 2: return <Medal className="w-3 h-3 text-gray-400" />;
    case 3: return <Award className="w-3 h-3 text-amber-600" />;
    default: return <Trophy className="w-3 h-3 text-muted-foreground" />;
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

// Helper function to get display name from profile data
function getDisplayName(row: LeaderboardRow): string {
  return row.displayName || row.username || `fid:${row.fid}`;
}

// Helper function to get display name for current user
function getCurrentUserDisplayName(profile: { displayName?: string | null; username?: string | null } | undefined): string {
  return profile?.displayName || profile?.username || "You";
}


// Grid template for consistent column widths across all rows - optimized for 3-digit max
const COLS = "[grid-template-columns:40px_minmax(0,1fr)_45px_35px_35px]"; 
// Rank | Name | Streak | Accuracy | Points
// Optimized: 40px rank, flexible name, 45px streak, 35px accuracy, 35px points
// Total: ~155px + name column (fits on smallest mobile screens)

// Reusable row component with proper truncation and no overlap
type RowProps = {
  rankLabel: React.ReactNode;   // e.g. "#1" or an icon+#
  name: string;                 // ENS or username
  subline?: string;             // shortened address
  streak: number;               // e.g. 25
  accuracyPct: number;          // e.g. 94
  points: number;               // e.g. 2850
  highlight?: boolean;          // for top 3 or "Your Stats"
};

function LeaderboardRow({
  rankLabel,
  name,
  subline,
  streak,
  accuracyPct,
  points,
  highlight,
}: RowProps) {
  return (
    <div
      className={`grid ${COLS} items-center gap-x-1 py-2 px-2 rounded-lg border ${
        highlight ? "bg-primary/5 border-primary/20" : "bg-gray-800 border-gray-700"
      }`}
    >
      {/* Rank */}
      <div className="flex items-center gap-1 min-w-0">
        <span className="shrink-0">{rankLabel}</span>
      </div>

      {/* Name (truncates) */}
      <div className="min-w-0">
        <div className="truncate font-medium text-white text-[12px]">{name}</div>
        {subline ? (
          <div className="truncate text-[9px] text-gray-400 font-mono">
            {subline}
          </div>
        ) : null}
      </div>

      {/* Streak */}
      <div className="text-center">
        <span className="inline-flex items-center justify-center px-0.5 py-0.5 text-[10px] rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold shrink-0">
          {streak}
        </span>
      </div>

      {/* Accuracy (never shrink) */}
      <div className="text-center">
        <span className="inline-flex items-center justify-center px-0.5 py-0.5 text-[9px] rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-semibold shrink-0 whitespace-nowrap">
          {accuracyPct}%
        </span>
      </div>

      {/* Points (never shrink) */}
      <div className="text-center">
        <span className="inline-flex items-center justify-center px-0.5 py-0.5 text-[9px] rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold shrink-0 whitespace-nowrap">
          {points.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage({
  searchParams,
}: {
  searchParams: { compact?: string; fid?: string };
}) {
  const compact = searchParams?.compact === "1";
  
  // Force cache bust - this should trigger a fresh deployment
  console.log("LEADERBOARD CACHE BUST - PROPER GRID TEMPLATE", Date.now());
  
  // Use real data hooks
  const { data: myStats, loading: myStatsLoading } = useMyStats();
  const { rows: leaderboardData, loading: leaderboardLoading } = useLeaderboard(50);

  // Establish session cookie on page load (fire and forget)
  // Session establishment is now handled by FarcasterReady component
  // React.useEffect(() => {
  //   // This will set the HttpOnly cookie if the request is signed
  //   fetch("/api/auth/establish", { method: "POST", cache: "no-store" }).catch(() => {});
  // }, []);


  // Use real user stats if available, otherwise fallback values
  const hasValidSession = myStats?.ok === true;
  const displayUser = {
    name: hasValidSession && myStats?.profile ? getCurrentUserDisplayName(myStats.profile) : "You",
    address: hasValidSession && myStats?.stats?.fid ? myStats.stats.fid : "—",
    currentStreak: hasValidSession ? (myStats.stats?.currentStreak ?? 0) : 0,
    accuracy: hasValidSession ? (myStats.accuracy ?? 0) : 0,
    totalPoints: hasValidSession ? (myStats.stats?.totalPoints ?? 0) : 0,
    rank: hasValidSession ? (myStats.rank ?? null) : null,
  };

  // Debug name data
  console.log("displayUser data:", displayUser);
  console.log("displayUser.name:", displayUser.name);
  console.log("formatDisplayName result:", formatDisplayName(displayUser.name, false));
  console.log("hasValidSession:", hasValidSession);
  console.log("myStats:", myStats);

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
                  <div className={`grid ${COLS} items-center gap-x-1 py-2 px-2 bg-gray-700/50 rounded-lg mb-4`}>
                    <div className="text-gray-300 text-[9px] font-semibold">Rank</div>
                    <div className="text-gray-300 text-[9px] font-semibold">Name</div>
                    <div className="text-center">
                      <Tooltip content="Streak">
                        <Flame className="w-4 h-4 text-orange-400 mx-auto cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="text-center">
                      <Tooltip content="Accuracy %">
                        <Users className="w-4 h-4 text-green-400 mx-auto cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="text-center">
                      <Tooltip content="Points">
                        <Trophy className="w-4 h-4 text-blue-400 mx-auto cursor-help" />
                      </Tooltip>
                    </div>
                  </div>

                <div className="space-y-2">
                  {leaderboardLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading leaderboard...</div>
                  ) : leaderboardData.length > 0 ? (
                    leaderboardData.map((u) => (
                      <LeaderboardRow
                        key={u.fid}
                        rankLabel={
                          <div className="flex items-center gap-1">
                            {getRankIcon(u.rank)}
                            <span className="font-bold text-xs">#{u.rank}</span>
                          </div>
                        }
                        name={getDisplayName(u)}
                        streak={u.currentStreak || 0}
                        accuracyPct={u.accuracy || 0}
                        points={u.points}
                        highlight={u.rank <= 3}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">No leaderboard data available</div>
                  )}
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
                    <Tooltip content="Streak">
                      <div className="flex items-center justify-center cursor-help">
                        <Flame className="w-3 h-3 text-orange-400" />
                      </div>
                    </Tooltip>
                    <Tooltip content="Accuracy">
                      <div className="flex items-center justify-center cursor-help">
                        <Users className="w-3 h-3 text-green-400" />
                      </div>
                    </Tooltip>
                    <Tooltip content="Points">
                      <div className="flex items-center justify-center cursor-help">
                        <Trophy className="w-3 h-3 text-blue-400" />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {leaderboardLoading ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
                  ) : leaderboardData.length > 0 ? (
                    leaderboardData.map((u) => (
                      <LeaderboardRow
                        key={u.fid}
                        rankLabel={
                          <div className="flex items-center gap-1">
                            {getRankIcon(u.rank)}
                            <span className="font-bold text-xs">#{u.rank}</span>
                          </div>
                        }
                        name={getDisplayName(u)}
                        streak={u.currentStreak || 0}
                        accuracyPct={u.accuracy || 0}
                        points={u.points}
                        highlight={u.rank <= 3}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">No data available</div>
                  )}
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
                  {/* Header - same grid as leaderboard */}
                  <div className={`grid ${COLS} items-center gap-x-1 py-2 px-2 bg-gray-700/50 rounded-lg mb-4`}>
                    <div className="text-gray-300 text-[9px] font-semibold">Rank</div>
                    <div className="text-gray-300 text-[9px] font-semibold">Name</div>
                    <div className="text-center">
                      <Flame className="w-4 h-4 text-orange-400 mx-auto" />
                    </div>
                    <div className="text-center">
                      <Users className="w-4 h-4 text-green-400 mx-auto" />
                    </div>
                    <div className="text-center">
                      <Trophy className="w-4 h-4 text-blue-400 mx-auto" />
                    </div>
                  </div>
                  
                  {/* Your Stats row using the same component */}
                  <LeaderboardRow
                    rankLabel={
                      <div className="flex items-center gap-1">
                        {getRankIcon(displayUser.rank || 999)}
                        <span className="font-bold text-xs">#{displayUser.rank || "—"}</span>
                      </div>
                    }
                    name={formatDisplayName(displayUser.name, false) || "Loading..."}
                    streak={displayUser.currentStreak}
                    accuracyPct={displayUser.accuracy}
                    points={displayUser.totalPoints}
                    highlight
                  />
                </div>
              ) : (
                /* ===== Compact layout ===== */
                <div className="relative rounded-lg border p-2 bg-card/50 border-primary/30">
                  {/* Rank section - absolute left */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 w-8">
                    {getRankIcon(displayUser.rank || 999)}
                    <span className="font-bold text-xs text-white">#{displayUser.rank || "—"}</span>
                  </div>

                  {/* Username section - centered with margins */}
                  <div className="mx-10 text-center">
                    <span className="font-medium text-xs text-white truncate block">{formatDisplayName(displayUser.name, true)}</span>
                  </div>

                  {/* Metrics section - absolute right */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full px-1 py-0.5 text-[10px] font-bold">
                      {displayUser.currentStreak}
                    </div>
                    <div className="border border-green-500/30 text-green-400 bg-green-500/10 rounded-full px-1 py-0.5 text-[10px] font-bold">
                      {displayUser.accuracy}%
                    </div>
                    <span className="text-primary font-bold text-xs tabular-nums">
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