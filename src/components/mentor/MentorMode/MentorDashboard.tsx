import { useState, useEffect } from 'react';
import { X, Users, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MenteeOverview from './MenteeOverview';
import MenteeInviteManager from './MenteeInviteManager';
import MenteeAnalytics from './MenteeAnalytics';
import { useMentorData } from '@/hooks/mentor/useMentorData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface MentorDashboardProps {
  onClose: () => void;
}

const MentorDashboard = ({ onClose }: MentorDashboardProps) => {
  const { user } = useAuth();
  const { mentees, isLoading, refetch } = useMentorData();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalMentees: 0,
    activeMentees: 0,
    avgPerformance: 0,
    needsAttention: 0
  });

  useEffect(() => {
    if (mentees.length > 0) {
      const activeMentees = mentees.filter(m => m.active).length;
      const totalPnL = mentees.reduce((sum, m) => sum + (m.totalPnL || 0), 0);
      const avgPerformance = totalPnL / mentees.length;
      const needsAttention = mentees.filter(m => (m.totalPnL || 0) < 0 || (m.winRate || 0) < 50).length;

      setStats({
        totalMentees: mentees.length,
        activeMentees,
        avgPerformance,
        needsAttention
      });
    }
  }, [mentees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[#f5dd01]" />
            <h1 className="text-2xl font-bold">Mentor Mode</h1>
          </div>
          <Badge className="bg-[#f5dd01] text-black font-semibold">PREMIUM</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="p-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Mentees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#f5dd01]">{stats.totalMentees}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Mentees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.activeMentees}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Avg Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.avgPerformance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(stats.avgPerformance)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.needsAttention}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6 h-[calc(100vh-280px)] overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Mentee Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-[#f5dd01] data-[state=active]:text-black">
              Manage Mentees
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[calc(100%-60px)] overflow-hidden">
            <TabsContent value="overview" className="h-full overflow-hidden">
              <MenteeOverview mentees={mentees} isLoading={isLoading} onRefresh={refetch} />
            </TabsContent>

            <TabsContent value="analytics" className="h-full overflow-hidden">
              <MenteeAnalytics mentees={mentees} />
            </TabsContent>

            <TabsContent value="manage" className="h-full overflow-hidden">
              <MenteeInviteManager onRefresh={refetch} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MentorDashboard;
