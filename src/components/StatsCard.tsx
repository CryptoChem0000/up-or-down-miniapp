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
            <span className="text-lg font-bold text-green-400">{accuracy}%</span>
          </div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    </Card>
  );
};
