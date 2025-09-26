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
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="text-center space-y-3">
        <div className="text-sm text-gray-400 font-medium">Current ETH Price</div>
        
        <div className="text-3xl font-bold text-white">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 font-medium border-2",
              isPositive 
                ? "border-green-500 text-green-400 bg-green-500/10" 
                : "border-red-500 text-red-400 bg-red-500/10"
            )}
          >
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          
          <span className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isPositive ? '+' : ''}${change24h.toFixed(2)}
          </span>
        </div>
        
        <div className="text-xs text-gray-400">24h change</div>
      </div>
    </Card>
  );
};
