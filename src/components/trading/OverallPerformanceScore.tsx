
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp, TrendingDown } from "lucide-react";
import { Trade, PerformanceStats } from "@/types/trade";

interface OverallPerformanceScoreProps {
  trades: Trade[];
  stats: PerformanceStats;
}

const OverallPerformanceScore = ({ trades, stats }: OverallPerformanceScoreProps) => {
  // Calculate performance score based on multiple factors
  const calculatePerformanceScore = () => {
    if (stats.totalTrades === 0) return { score: 0, grade: 'N/A', color: 'bg-gray-500' };
    
    let score = 0;
    let factors = 0;
    
    // Win rate factor (0-25 points)
    if (stats.winRate >= 0) {
      score += Math.min(stats.winRate * 0.25, 25);
      factors++;
    }
    
    // Profit factor (0-20 points)
    if (stats.profitFactor > 0) {
      if (stats.profitFactor >= 2) score += 20;
      else if (stats.profitFactor >= 1.5) score += 15;
      else if (stats.profitFactor >= 1.2) score += 10;
      else if (stats.profitFactor >= 1) score += 5;
      factors++;
    }
    
    // Sharpe ratio factor (0-15 points)
    if (stats.sharpeRatio > 0) {
      if (stats.sharpeRatio >= 2) score += 15;
      else if (stats.sharpeRatio >= 1.5) score += 12;
      else if (stats.sharpeRatio >= 1) score += 8;
      else if (stats.sharpeRatio >= 0.5) score += 4;
      factors++;
    }
    
    // Risk-reward ratio factor (0-15 points)
    if (stats.riskRewardRatio > 0) {
      if (stats.riskRewardRatio >= 2) score += 15;
      else if (stats.riskRewardRatio >= 1.5) score += 12;
      else if (stats.riskRewardRatio >= 1) score += 8;
      else score += 4;
      factors++;
    }
    
    // Consistency factor - max drawdown (0-10 points)
    if (stats.maxDrawdown >= 0) {
      if (stats.maxDrawdown <= 5) score += 10;
      else if (stats.maxDrawdown <= 10) score += 8;
      else if (stats.maxDrawdown <= 15) score += 6;
      else if (stats.maxDrawdown <= 20) score += 4;
      else if (stats.maxDrawdown <= 30) score += 2;
      factors++;
    }
    
    // Total trades factor - experience bonus (0-5 points)
    if (stats.totalTrades >= 100) score += 5;
    else if (stats.totalTrades >= 50) score += 4;
    else if (stats.totalTrades >= 25) score += 3;
    else if (stats.totalTrades >= 10) score += 2;
    else if (stats.totalTrades >= 5) score += 1;
    factors++;
    
    // Expectancy factor (0-10 points)
    if (stats.expectancy > 0) {
      if (stats.expectancy >= 1) score += 10;
      else if (stats.expectancy >= 0.5) score += 8;
      else if (stats.expectancy >= 0.2) score += 6;
      else if (stats.expectancy >= 0.1) score += 4;
      else score += 2;
    }
    factors++;
    
    // Normalize score to 0-100
    const finalScore = Math.min(Math.round(score), 100);
    
    // Determine grade and color based on score
    let grade = 'F';
    let color = 'bg-red-500';
    
    if (finalScore >= 90) {
      grade = 'A+';
      color = 'bg-green-600';
    } else if (finalScore >= 85) {
      grade = 'A';
      color = 'bg-green-500';
    } else if (finalScore >= 80) {
      grade = 'A-';
      color = 'bg-green-400';
    } else if (finalScore >= 75) {
      grade = 'B+';
      color = 'bg-lime-500';
    } else if (finalScore >= 70) {
      grade = 'B';
      color = 'bg-yellow-500';
    } else if (finalScore >= 65) {
      grade = 'B-';
      color = 'bg-yellow-400';
    } else if (finalScore >= 60) {
      grade = 'C+';
      color = 'bg-orange-500';
    } else if (finalScore >= 55) {
      grade = 'C';
      color = 'bg-orange-400';
    } else if (finalScore >= 50) {
      grade = 'C-';
      color = 'bg-orange-300';
    } else if (finalScore >= 40) {
      grade = 'D';
      color = 'bg-red-400';
    } else {
      grade = 'F';
      color = 'bg-red-500';
    }
    
    return { score: finalScore, grade, color };
  };

  const performance = calculatePerformanceScore();

  // Get performance insights
  const getPerformanceInsights = () => {
    const insights = [];
    
    if (stats.winRate < 50) {
      insights.push("Consider reviewing your entry criteria to improve win rate");
    }
    if (stats.profitFactor < 1.2) {
      insights.push("Focus on increasing profit factor by managing winners and losers better");
    }
    if (stats.maxDrawdown > 20) {
      insights.push("High drawdown detected - consider better risk management");
    }
    if (stats.totalTrades < 30) {
      insights.push("More trading data needed for accurate performance assessment");
    }
    if (stats.riskRewardRatio < 1) {
      insights.push("Improve risk-reward ratio by letting winners run longer");
    }
    
    return insights;
  };

  const insights = getPerformanceInsights();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl font-bold">
                {performance.score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <div className="space-y-2">
                <Badge className={`${performance.color} text-white px-3 py-1 text-lg`}>
                  {performance.grade} - {
                    performance.score >= 85 ? 'Excellent' :
                    performance.score >= 70 ? 'Good' :
                    performance.score >= 55 ? 'Average' :
                    performance.score >= 40 ? 'Below Average' : 'Poor'
                  }
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {stats.totalTrades > 0 && stats.netPnL > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Profitable Trader</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span>Needs Improvement</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-32">
              <Progress value={performance.score} className="h-3" />
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-lg font-semibold">{stats.winRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-lg font-semibold">{stats.profitFactor.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Profit Factor</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-lg font-semibold">{stats.riskRewardRatio.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Risk/Reward</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-lg font-semibold">{stats.maxDrawdown.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
            </div>
          </div>

          {/* Performance Insights */}
          {insights.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Performance Insights</h4>
              <ul className="space-y-1">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallPerformanceScore;
