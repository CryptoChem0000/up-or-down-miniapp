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
    <Card className="p-2 bg-gray-800 border-gray-700">
      <div className="text-center space-y-0.5">
        <div className="text-xs text-gray-400 font-medium">Current ETH Price</div>
        
        <div className="text-lg font-bold text-white">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span className={cn(
            "text-xs font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}% • {isPositive ? '+' : ''}${change24h.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};
