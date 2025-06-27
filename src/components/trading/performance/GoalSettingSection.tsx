import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Circle, Calendar, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  targetDate: string;
  category: 'profit' | 'winrate' | 'consistency' | 'risk' | 'other';
  status: 'active' | 'completed' | 'overdue';
  createdAt: string;
}

interface GoalSettingSectionProps {
  currentStats: {
    totalPnL: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

const GoalSettingSection = ({ currentStats }: GoalSettingSectionProps) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Reach $5,000 Profit',
      description: 'Achieve consistent monthly profitability',
      targetValue: 5000,
      currentValue: currentStats.totalPnL,
      targetDate: '2024-12-31',
      category: 'profit',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2', 
      title: 'Improve Win Rate to 65%',
      description: 'Focus on better trade selection and entry points',
      targetValue: 65,
      currentValue: currentStats.winRate,
      targetDate: '2024-08-15',
      category: 'winrate',
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    targetDate: '',
    category: 'profit' as Goal['category']
  });

  const addGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      currentValue: getCurrentValue(newGoal.category),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetValue: 0, targetDate: '', category: 'profit' });
    setShowAddGoal(false);
  };

  const getCurrentValue = (category: Goal['category']) => {
    switch (category) {
      case 'profit': return currentStats.totalPnL;
      case 'winrate': return currentStats.winRate;
      case 'consistency': return currentStats.sharpeRatio;
      case 'risk': return currentStats.maxDrawdown;
      default: return 0;
    }
  };

  const getProgress = (goal: Goal) => {
    if (goal.category === 'risk') {
      // For risk metrics, lower is better
      return Math.max(0, Math.min(100, ((goal.targetValue - goal.currentValue) / goal.targetValue) * 100));
    }
    return Math.max(0, Math.min(100, (goal.currentValue / goal.targetValue) * 100));
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'profit': return <TrendingUp className="w-4 h-4" />;
      case 'winrate': return <Target className="w-4 h-4" />;
      case 'consistency': return <CheckCircle className="w-4 h-4" />;
      case 'risk': return <Circle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'profit': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'winrate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'consistency': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'risk': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Goal Setting & Milestone Tracking
            </CardTitle>
            <Button 
              onClick={() => setShowAddGoal(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const isCompleted = progress >= 100;
              
              return (
                <Card key={goal.id} className="bg-gray-700/50 border-gray-600">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(goal.category)}
                        <h4 className="font-semibold text-white">{goal.title}</h4>
                      </div>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Current: {goal.category === 'profit' ? `$${goal.currentValue.toFixed(2)}` : `${goal.currentValue.toFixed(1)}${goal.category === 'winrate' ? '%' : ''}`}
                      </span>
                      <span className="text-gray-400">
                        Target: {goal.category === 'profit' ? `$${goal.targetValue}` : `${goal.targetValue}${goal.category === 'winrate' ? '%' : ''}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {isCompleted && (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Goal Achieved!
                        </div>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showAddGoal && (
            <Card className="mt-4 bg-gray-700/30 border-gray-600">
              <CardHeader>
                <CardTitle className="text-lg">Add New Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalTitle">Goal Title</Label>
                    <Input
                      id="goalTitle"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Reach $10,000 profit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalCategory">Category</Label>
                    <Select value={newGoal.category} onValueChange={(value: Goal['category']) => setNewGoal({...newGoal, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profit">Profit Target</SelectItem>
                        <SelectItem value="winrate">Win Rate</SelectItem>
                        <SelectItem value="consistency">Consistency</SelectItem>
                        <SelectItem value="risk">Risk Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetValue">Target Value</Label>
                    <Input
                      id="targetValue"
                      type="number"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal({...newGoal, targetValue: parseFloat(e.target.value)})}
                      placeholder="Target amount or percentage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="goalDescription">Description</Label>
                  <Textarea
                    id="goalDescription"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe your goal and strategy to achieve it"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addGoal} className="bg-green-600 hover:bg-green-700">
                    Add Goal
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSettingSection;
