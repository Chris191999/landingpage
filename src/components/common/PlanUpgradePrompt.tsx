
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanUpgradePromptProps {
  feature: string;
  requiredPlan: 'Cooked' | 'Goated' | 'Let him cook (free)';
  currentPlan?: string;
  className?: string;
}

const PlanUpgradePrompt = ({ 
  feature, 
  requiredPlan, 
  currentPlan = 'Let him cook (free)',
  className = ''
}: PlanUpgradePromptProps) => {
  const isCooked = requiredPlan === 'Cooked';
  const isFree = requiredPlan === 'Let him cook (free)';
  
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      {/* Enhanced blur background overlay */}
      <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-md rounded-lg z-10" />
      
      {/* Centered upgrade prompt */}
      <Card className="relative z-20 w-full max-w-md mx-4 bg-gray-800/95 border-gray-600 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isCooked ? (
              <Lock className="w-16 h-16 text-purple-400 mx-auto" />
            ) : (
              <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">
            {feature} {isFree ? 'Available' : 'Locked'}
          </h3>
          
          <p className="text-gray-300 text-base mb-6 leading-relaxed">
            {isFree ? (
              `This feature is available in your current plan`
            ) : (
              <>
                Upgrade to <span className={`font-semibold ${isCooked ? 'text-purple-400' : 'text-yellow-400'}`}>
                  {requiredPlan}
                </span> plan to access this premium feature
              </>
            )}
          </p>
          
          {!isFree && (
            <div className="space-y-3">
              <Link to="/pricing" className="block">
                <Button 
                  className={`w-full py-3 text-base font-semibold ${
                    isCooked 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white transition-colors duration-200`}
                >
                  Upgrade to {requiredPlan}
                </Button>
              </Link>
              
              <p className="text-xs text-gray-400">
                Current plan: <span className="font-medium">{currentPlan}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanUpgradePrompt;
