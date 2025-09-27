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
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-400 font-medium">Current ETH Price</div>
        
        <div className="text-2xl font-bold text-white">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-0.5 text-xs font-medium border",
              isPositive 
                ? "border-green-500 text-green-400 bg-green-500/10" 
                : "border-red-500 text-red-400 bg-red-500/10"
            )}
          >
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          
          <span className={cn(
            "text-xs font-medium",
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
