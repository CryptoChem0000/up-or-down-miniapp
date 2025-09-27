import React from "react";
import Link from "next/link";
import { Trophy, Crown, Medal, Award, ArrowLeft, User } from "lucide-react";
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
  { id: 1, name: "alice.eth", address: "0x742d35Cc82C0...f4C8BD45c4", currentStreak: 25, accuracy: 94, totalPoints: 2850, rank: 1 },
  { id: 2, name: "0x8ba1f109...7e3c2a9f", address: "0x8ba1f109551bD432803012b06f3C8...7e3c2a9f", currentStreak: 18, accuracy: 91, totalPoints: 2340, rank: 2 },
  { id: 3, name: "bob.crypto", address: "0x1f2f377d...891b5c2f", currentStreak: 22, accuracy: 88, totalPoints: 2180, rank: 3 },
  { id: 4, name: "0x9d4a1c2b...f8e7d6a9", address: "0x9d4a1c2b3e5f4a7b8c9d0e1f2a3b4c...f8e7d6a9", currentStreak: 15, accuracy: 86, totalPoints: 1950, rank: 4 },
  { id: 5, name: "trader.defi", address: "0x3c8b7a9e...2d1f4e8b", currentStreak: 12, accuracy: 83, totalPoints: 1720, rank: 5 },
  { id: 6, name: "0xa7b8c9d0...5e4f3a2b", address: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1...5e4f3a2b", currentStreak: 8, accuracy: 79, totalPoints: 1480, rank: 6 },
];

// Mock current user data
const currentUser = {
  name: "your.wallet",
  address: "0x1234567890abcdef...1234567890abcdef",
  currentStreak: 7,
  accuracy: 85,
  totalPoints: 1240,
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

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-6 h-6 text-primary" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-700/50 rounded-lg mb-4 font-semibold text-sm text-gray-300">
                <div>Rank</div>
                <div>Name</div>
                <div className="text-center">Current Streak</div>
                <div className="text-center">Accuracy</div>
                <div className="text-center">Total Points</div>
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
                      <span className="font-medium text-white">{u.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{u.address}</span>
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
            </div>
          </CardContent>
        </Card>

        {/* Your Stats Section */}
        <div className="mt-8">
          <Separator className="mb-6 bg-gray-600" />
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-6 h-6 text-primary" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-700/50 rounded-lg mb-4 font-semibold text-sm text-gray-300">
                  <div>Rank</div>
                  <div>Name</div>
                  <div className="text-center">Current Streak</div>
                  <div className="text-center">Accuracy</div>
                  <div className="text-center">Total Points</div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 py-4 px-4 rounded-lg border bg-card/50 border-primary/30">
                  <div className="flex items-center gap-2">
                    {getRankIcon(currentUser.rank)}
                    <span className="font-bold text-white">#{currentUser.rank}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{currentUser.name}</span>
                    <span className="text-xs text-gray-400 font-mono">
                      {currentUser.address}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="secondary" className="font-bold bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {currentUser.currentStreak}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <Badge 
                      variant={currentUser.accuracy >= 90 ? "default" : "outline"}
                      className="font-bold border-green-500/30 text-green-400 bg-green-500/10"
                    >
                      {currentUser.accuracy}%
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-lg font-bold text-primary">
                      {currentUser.totalPoints.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}