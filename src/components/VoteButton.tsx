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
        "h-20 text-lg font-bold transition-all duration-300 relative overflow-hidden group",
        "border-2 hover:scale-105 active:scale-95",
        isUp
          ? "bg-gradient-success border-success text-success-foreground hover:shadow-success"
          : "bg-gradient-danger border-danger text-danger-foreground hover:shadow-danger",
        isSelected && "shadow-lg ring-2 ring-white/30",
        className
      )}
      size="lg"
    >
      <div className="flex items-center gap-3 relative z-10">
        {isUp ? (
          <TrendingUp className="w-6 h-6" />
        ) : (
          <TrendingDown className="w-6 h-6" />
        )}
        <span>{isUp ? "UP" : "DOWN"}</span>
      </div>
      
      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300",
        isUp ? "bg-success" : "bg-danger"
      )} />
    </Button>
  );
};
