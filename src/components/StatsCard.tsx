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
    <Card className="p-5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      
      <div className="relative grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-xl font-bold text-orange-400">{streak}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Streak</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-bold text-white">{totalVotes}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Votes</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-xl font-bold text-emerald-400">{accuracy}%</span>
          </div>
          <div className="text-xs text-slate-400 font-medium">Accuracy</div>
        </div>
      </div>
    </Card>
  );
};
