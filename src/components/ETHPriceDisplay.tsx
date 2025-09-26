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
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="text-center space-y-3">
        <div className="text-sm text-muted-foreground font-medium">Current ETH Price</div>
        
        <div className="text-3xl font-bold text-foreground">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 font-medium border-2",
              isPositive 
                ? "border-success text-success bg-success/10" 
                : "border-danger text-danger bg-danger/10"
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
            isPositive ? "text-success" : "text-danger"
          )}>
            {isPositive ? '+' : ''}${change24h.toFixed(2)}
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground">24h change</div>
      </div>
    </Card>
  );
};
