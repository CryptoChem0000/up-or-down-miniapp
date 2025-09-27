"use client";

import React, { useState } from "react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Flame, Users, Trophy, X } from "lucide-react";
import * as ToastPrimitives from "@radix-ui/react-toast";

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

/** Toast */
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport ref={ref} className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className)} {...props} />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  { variants: { variant: { default: "border bg-background text-foreground", destructive: "destructive group border-destructive bg-destructive text-destructive-foreground" }}, defaultVariants: { variant: "default" } }
);
const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Root>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>>(
  ({ className, variant, ...props }, ref) => <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Close>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Close ref={ref} className={cn("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className)} toast-close="" {...props}>
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  )
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>>(
  ({ className, ...props }, ref) => <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<React.ElementRef<typeof ToastPrimitives.Description>, React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>>(
  ({ className, ...props }, ref) => <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

/** tiny toast store */
const TOAST_LIMIT = 1; const TOAST_REMOVE_DELAY = 1000000;
type ToasterToast = { id: string; title?: React.ReactNode; description?: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean)=>void; };
const actionTypes = { ADD_TOAST: "ADD_TOAST", UPDATE_TOAST: "UPDATE_TOAST", DISMISS_TOAST: "DISMISS_TOAST", REMOVE_TOAST: "REMOVE_TOAST" } as const;
let count = 0; function genId(){ count=(count+1)%Number.MAX_SAFE_INTEGER; return count.toString(); }
type ActionType = typeof actionTypes;
type Action =
 | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
 | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
 | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
 | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] };
interface State { toasts: ToasterToast[] }
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const addToRemoveQueue = (toastId: string) => { if (toastTimeouts.has(toastId)) return; const timeout=setTimeout(()=>{ toastTimeouts.delete(toastId); dispatch({ type:"REMOVE_TOAST", toastId }); }, TOAST_REMOVE_DELAY); toastTimeouts.set(toastId, timeout); };
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST": return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE_TOAST": return { ...state, toasts: state.toasts.map((t)=>(t.id===action.toast.id?{...t,...action.toast}:t)) };
    case "DISMISS_TOAST": { const { toastId } = action; if (toastId) addToRemoveQueue(toastId); else state.toasts.forEach(t=>addToRemoveQueue(t.id)); return { ...state, toasts: state.toasts.map(t => (t.id===toastId || toastId===undefined)?{...t, open:false}:t) }; }
    case "REMOVE_TOAST": return action.toastId===undefined ? { ...state, toasts: [] } : { ...state, toasts: state.toasts.filter(t=>t.id!==action.toastId) };
  }
};
const listeners: Array<(s: State)=>void> = []; let memoryState: State = { toasts: [] };
function dispatch(action: Action){ memoryState=reducer(memoryState, action); listeners.forEach(l=>l(memoryState)); }
type Toast = Omit<ToasterToast,"id">;
function toast({ ...props }: Toast){ const id=genId(); const update=(props: ToasterToast)=>dispatch({ type:"UPDATE_TOAST", toast:{...props,id} }); const dismiss=()=>dispatch({ type:"DISMISS_TOAST", toastId:id }); dispatch({ type:"ADD_TOAST", toast:{ ...props, id, open:true, onOpenChange:(open)=>{ if(!open) dismiss(); }}}); return { id, dismiss, update }; }
function useToast(){ const [state,setState]=React.useState<State>(memoryState); React.useEffect(()=>{ listeners.push(setState); return ()=>{ const i=listeners.indexOf(setState); if(i>-1) listeners.splice(i,1); }; },[state]); return { ...state, toast, dismiss:(toastId?:string)=>dispatch({ type:"DISMISS_TOAST", toastId }) }; }
function Toaster(){ const { toasts } = useToast(); return (<ToastProvider>{toasts.map(({ id, title, description, ...props }) => (<Toast key={id} {...props}><div className="grid gap-1">{title && <ToastTitle>{title}</ToastTitle>}{description && <ToastDescription>{description}</ToastDescription>}</div><ToastClose/></Toast>))}<ToastViewport/></ToastProvider>); }

/** UI bits */
interface VoteButtonProps { direction: "up" | "down"; onClick: () => void; isSelected?: boolean; className?: string; }
const VoteButton = ({ direction, onClick, isSelected, className }: VoteButtonProps) => {
  const isUp = direction === "up";
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-20 text-lg font-bold transition-all duration-300 relative overflow-hidden group",
        "border-2 hover:scale-105 active:scale-95",
        isUp ? "bg-green-500 border-green-500 text-white hover:shadow-lg hover:shadow-green-500/25"
             : "bg-red-500 border-red-500 text-white hover:shadow-lg hover:shadow-red-500/25",
        isSelected && "ring-2 ring-white/30 shadow-xl",
        className
      )}
      size="lg"
    >
      <div className="flex items-center gap-3 relative z-10">
        {isUp ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        <span>{isUp ? "UP" : "DOWN"}</span>
      </div>
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300", isUp ? "bg-green-500" : "bg-red-500")} />
    </Button>
  );
};

interface ETHPriceDisplayProps { price: number; change24h: number; changePercent: number; }
const ETHPriceDisplay = ({ price, change24h, changePercent }: ETHPriceDisplayProps) => {
  const positive = change24h >= 0;
  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="text-center space-y-3">
        <div className="text-sm text-gray-400 font-medium">Current ETH Price</div>
        <div className="text-3xl font-bold text-white">${price.toLocaleString()}</div>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className={cn("px-3 py-1 font-medium border-2", positive ? "border-green-500 text-green-400 bg-green-500/10" : "border-red-500 text-red-400 bg-red-500/10")}>
            <div className="flex items-center gap-1">
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{positive ? "+" : ""}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          <span className={cn("text-sm font-medium", positive ? "text-green-400" : "text-red-400")}>
            {positive ? "+" : ""}${change24h.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-gray-400">24h change</div>
      </div>
    </Card>
  );
};

interface StatsCardProps { streak: number; totalVotes: number; accuracy: number; points?: number; }
const StatsCard = ({ streak, totalVotes, accuracy, points }: StatsCardProps) => (
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
          <span className="text-lg font-bold text-white">{totalVotes}</span>
        </div>
        <div className="text-xs text-gray-400">Votes</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Trophy className="w-4 h-4 text-green-400" />
          <span className="text-lg font-bold text-green-400">{points ? points.toLocaleString() : accuracy + '%'}</span>
        </div>
        <div className="text-xs text-gray-400">{points ? 'Points' : 'Accuracy'}</div>
      </div>
    </div>
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
  const [selectedVote, setSelectedVote] = useState<"up" | "down" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [my, setMy] = useState<{streak:number; points:number} | null>(null);
  const { toast } = useToast();

  // Load personal stats if fid is in URL
  React.useEffect(() => {
    const fid = new URL(window.location.href).searchParams.get("fid");
    if (!fid) return;
    fetch(`/api/user/${fid}`).then(r => r.json()).then(setMy).catch(() => {});
  }, []);

  // Mock UI data for the card (replace with API later)
  const ethData = { price: 3420.5, change24h: 127.32, changePercent: 3.87 };
  const userStats = { 
    streak: my?.streak ?? 7, 
    totalVotes: 23, 
    accuracy: 74,
    points: my?.points ?? 0
  };

  function handleVote(dir: "up" | "down") {
    if (hasVoted) return;
    setSelectedVote(dir); setHasVoted(true);
    toast({ title: `Voted ${dir.toUpperCase()}!`, description: "Your prediction has been recorded. Check back tomorrow for results!" });
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-[424px] h-[695px] bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 60px -12px rgba(0,0,0,0.8)" }}>
          <div className="h-full flex flex-col p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-black/90 border border-white/10 flex items-center justify-center">
                  <img
                    src="/eth-mark-tight-20.png"
                    alt="ETH"
                    width={20}
                    height={20}
                    decoding="async"
                    loading="eager"
                  />
                </div>
                <h1 className="text-xl font-bold text-white">Daily ETH Poll</h1>
              </div>
              <p className="text-gray-400 text-sm">Will ETH price go up or down today?</p>
              {!hasVoted && <Badge variant="outline" className="border-primary text-primary">Vote closes at midnight UTC</Badge>}
            </div>

            <ETHPriceDisplay price={ethData.price} change24h={ethData.change24h} changePercent={ethData.changePercent} />

            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2 text-white">Make Your Prediction</h2>
                {hasVoted && <Badge variant="outline" className="border-green-500 text-green-400">Voted {selectedVote?.toUpperCase()} ✓</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <VoteButton direction="up" onClick={() => handleVote("up")} isSelected={selectedVote === "up"} className={hasVoted && selectedVote !== "up" ? "opacity-50" : ""} />
                <VoteButton direction="down" onClick={() => handleVote("down")} isSelected={selectedVote === "down"} className={hasVoted && selectedVote !== "down" ? "opacity-50" : ""} />
              </div>
            </div>

            <StatsCard streak={userStats.streak} totalVotes={userStats.totalVotes} accuracy={userStats.accuracy} points={userStats.points} />

            <div className="mt-auto">
              <Card className="p-3 bg-gray-800 border-gray-700">
                <div className="text-xs text-gray-400 text-center space-y-2">
                  <div>Build your streak • Compete with others</div>
                  <div className="text-primary">Results revealed daily at 12:01 AM UTC</div>

                  <div className="flex gap-2 justify-center mt-2">
                    <a href="/api/frames" className="text-primary hover:underline">Frame →</a>
                    <a href="/test" className="text-primary hover:underline">Test Panel →</a>
                  </div>

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

                  <div className="text-[11px] opacity-70 pt-2">
                    Voting requires tapping inside the Farcaster frame (verified by Neynar).
                  </div>
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
