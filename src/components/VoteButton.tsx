import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  direction: "up" | "down";
  onClick: () => void;
  isSelected?: boolean;
  className?: string;
}

export const VoteButton = ({ direction, onClick, isSelected, className }: VoteButtonProps) => {
  const isUp = direction === "up";
  
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-24 text-xl font-bold transition-all duration-300 relative overflow-hidden group",
        "border-2 hover:scale-105 active:scale-95 backdrop-blur-sm",
        isUp
          ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500/50 text-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          : "bg-gradient-to-br from-red-500/20 to-rose-600/20 border-red-500/50 text-red-400 hover:shadow-lg hover:shadow-red-500/25",
        isSelected && "ring-2 ring-white/30 shadow-xl",
        className
      )}
      size="lg"
    >
      {/* Background pattern */}
      <div className={cn(
        "absolute inset-0 opacity-20",
        isUp 
          ? "bg-gradient-to-br from-emerald-500/30 to-green-500/30" 
          : "bg-gradient-to-br from-red-500/30 to-rose-500/30"
      )} />
      
      <div className="flex items-center gap-4 relative z-10">
        {isUp ? (
          <TrendingUp className="w-7 h-7" />
        ) : (
          <TrendingDown className="w-7 h-7" />
        )}
        <span className="text-2xl">{isUp ? "UP" : "DOWN"}</span>
      </div>
      
      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300",
        isUp 
          ? "bg-gradient-to-br from-emerald-500/40 to-green-500/40" 
          : "bg-gradient-to-br from-red-500/40 to-rose-500/40"
      )} />
    </Button>
  );
};
