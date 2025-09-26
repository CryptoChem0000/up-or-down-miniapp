import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Users, Trophy } from "lucide-react";

interface StatsCardProps {
  streak: number;
  totalVotes: number;
  accuracy: number;
}

export const StatsCard = ({ streak, totalVotes, accuracy }: StatsCardProps) => {
  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-lg font-bold text-warning">{streak}</span>
          </div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold">{totalVotes}</span>
          </div>
          <div className="text-xs text-muted-foreground">Votes</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4 text-success" />
            <span className="text-lg font-bold">{accuracy}%</span>
          </div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>
    </Card>
  );
};
