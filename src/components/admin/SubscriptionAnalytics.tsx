
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Crown, Users, TrendingUp, AlertTriangle } from "lucide-react";
import type { ProfileWithEmail } from "@/hooks/useAdminUsers";

interface SubscriptionAnalyticsProps {
  profiles: ProfileWithEmail[];
}

const SubscriptionAnalytics = ({ profiles }: SubscriptionAnalyticsProps) => {
  const planStats = profiles.reduce((acc, profile) => {
    const planName = profile.plan || 'Let him cook (free)';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalUsers = profiles.length;
  const paidUsers = profiles.filter(p => p.plan && p.plan !== 'Let him cook (free)').length;
  const freeUsers = totalUsers - paidUsers;
  const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0;

  // Expiring subscriptions (within 7 days)
  const expiringUsers = profiles.filter(profile => {
    if (!profile.expires_at) return false;
    const expirationDate = new Date(profile.expires_at);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
  });

  // Expired subscriptions
  const expiredUsers = profiles.filter(profile => {
    if (!profile.expires_at) return false;
    const expirationDate = new Date(profile.expires_at);
    const today = new Date();
    return expirationDate < today;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Let him cook (free)':
        return 'bg-gray-500';
      case 'Cooked':
        return 'bg-purple-500';
      case 'Goated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {paidUsers} paid • {freeUsers} free
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <Progress value={conversionRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{expiringUsers.length}</div>
          <p className="text-xs text-muted-foreground">Within 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{expiredUsers.length}</div>
          <p className="text-xs text-muted-foreground">Need renewal</p>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plan Distribution
          </CardTitle>
        </CardHeader>  
        <CardContent>
          <div className="space-y-3">
            {Object.entries(planStats).map(([planName, count]) => (
              <div key={planName} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`${getPlanColor(planName)} text-white`}>
                    {planName}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{count} users</span>
                </div>
                <div className="text-sm font-medium">
                  {totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expiring Subscriptions Details */}
      {expiringUsers.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Expiring Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {expiringUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{user.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.plan}</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    Expires {formatDate(user.expires_at)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionAnalytics;
