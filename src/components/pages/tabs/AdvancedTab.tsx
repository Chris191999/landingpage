
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { usePlanFeatures } from "@/hooks/usePlanFeatures";
import PlanUpgradePrompt from "@/components/common/PlanUpgradePrompt";
import AdvancedPerformanceMetrics from "@/components/trading/AdvancedPerformanceMetrics";
import AdvancedRiskAnalytics from "@/components/trading/AdvancedRiskAnalytics";
import PsychologyDashboard from "@/components/trading/advanced/PsychologyDashboard";
import TimeAnalysisDashboard from "@/components/trading/advanced/TimeAnalysisDashboard";

interface AdvancedTabProps {
  trades: Trade[];
}

const AdvancedTab = ({ trades }: AdvancedTabProps) => {
  const { data: planFeatures } = usePlanFeatures();
  
  const hasAdvancedAccess = planFeatures?.advanced_analytics_performancetab_access || false;
  const hasRiskAccess = planFeatures?.risk_access || false;
  const hasPsychologyAccess = planFeatures?.psychology_access || false;
  const hasTimeAccess = planFeatures?.time_analysis_access || false;

  // If user has no access to any advanced features, show main upgrade prompt
  if (!hasAdvancedAccess && !hasRiskAccess && !hasPsychologyAccess && !hasTimeAccess) {
    return (
      <TabsContent value="advanced" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanUpgradePrompt 
              feature="Advanced Analytics"
              requiredPlan="Goated"
              currentPlan={planFeatures?.plan_name}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="advanced" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
        <p className="text-muted-foreground mb-6">
          Deep dive into your trading performance with advanced risk management, psychology, and time analysis.
        </p>
      </div>

      <Tabs defaultValue="psychology" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">
            Performance
          </TabsTrigger>
          <TabsTrigger value="risk">
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="psychology">
            Psychology
          </TabsTrigger>
          <TabsTrigger value="time">
            Time Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {hasAdvancedAccess ? (
            <AdvancedPerformanceMetrics trades={trades} />
          ) : (
            <div className="space-y-4">
              {/* Upgrade prompt positioned right below tabs */}
              <PlanUpgradePrompt 
                feature="Advanced Performance Metrics"
                requiredPlan="Goated"
                currentPlan={planFeatures?.plan_name}
                className="relative"
              />
              {/* Blurred content with stronger blur */}
              <div className="filter blur-lg pointer-events-none">
                <AdvancedPerformanceMetrics trades={trades} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {hasRiskAccess ? (
            <AdvancedRiskAnalytics trades={trades} />
          ) : (
            <div className="space-y-4">
              {/* Upgrade prompt positioned right below tabs */}
              <PlanUpgradePrompt 
                feature="Risk Analytics"
                requiredPlan="Goated"
                currentPlan={planFeatures?.plan_name}
                className="relative"
              />
              {/* Blurred content with stronger blur */}
              <div className="filter blur-lg pointer-events-none">
                <AdvancedRiskAnalytics trades={trades} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="psychology" className="space-y-6">
          {hasPsychologyAccess ? (
            <PsychologyDashboard trades={trades} />
          ) : (
            <div className="space-y-4">
              {/* Upgrade prompt positioned right below tabs */}
              <PlanUpgradePrompt 
                feature="Psychology Analysis"
                requiredPlan="Let him cook (free)"
                currentPlan={planFeatures?.plan_name}
                className="relative"
              />
              {/* Blurred content with stronger blur */}
              <div className="filter blur-lg pointer-events-none">
                <PsychologyDashboard trades={trades} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          {hasTimeAccess ? (
            <TimeAnalysisDashboard trades={trades} />
          ) : (
            <div className="space-y-4">
              {/* Upgrade prompt positioned right below tabs */}
              <PlanUpgradePrompt 
                feature="Time Analysis"
                requiredPlan="Goated"
                currentPlan={planFeatures?.plan_name}
                className="relative"
              />
              {/* Blurred content with stronger blur */}
              <div className="filter blur-lg pointer-events-none">
                <TimeAnalysisDashboard trades={trades} />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
};

export default AdvancedTab;
