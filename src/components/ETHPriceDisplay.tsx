import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ETHPriceDisplayProps {
  price: number;
  change24h: number;
  changePercent: number;
}

export const ETHPriceDisplay = ({ price, change24h, changePercent }: ETHPriceDisplayProps) => {
  const isPositive = change24h >= 0;
  
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-10",
        isPositive 
          ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20" 
          : "bg-gradient-to-br from-red-500/20 to-rose-500/20"
      )} />
      
      <div className="relative text-center space-y-4">
        <div className="text-sm text-slate-400 font-medium">Current ETH Price</div>
        
        <div className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Badge 
            variant="outline" 
            className={cn(
              "px-4 py-2 font-semibold border-2 backdrop-blur-sm",
              isPositive 
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" 
                : "border-red-500/50 text-red-400 bg-red-500/10"
            )}
          >
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          
          <span className={cn(
            "text-sm font-semibold",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? '+' : ''}${change24h.toFixed(2)}
          </span>
        </div>
        
        <div className="text-xs text-slate-500">24h change</div>
      </div>
    </Card>
  );
};
