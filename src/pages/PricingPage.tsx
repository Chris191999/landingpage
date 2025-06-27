
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelection = (plan: string) => {
    if (user) {
      // For existing users, redirect to payment page with plan details
      navigate('/payment', { 
        state: { 
          plan: plan,
          isUpgrade: true 
        } 
      });
    } else {
      // For new users, redirect to auth
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen dark-tech-bg px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Pricing Plans</h1>
          <p className="text-xl text-white/70">Choose the plan that fits your trading journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Let him cook (free) */}
          <div className="plan-card plan-card-free p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white/90 mb-4">Let him cook</h4>
            <div className="text-5xl font-black text-white mb-6">FREE</div>
            <ul className="space-y-4 mb-8 text-left">
              {[
                "Overview dashboard with calendar",
                "Add trades dashboard",
                "Zip file import/export only",
                "Advanced psychology section",
                "1 image upload per trade"
              ].map((feature, i) => (
                <li key={i} className="text-white/80 flex items-center gap-2 text-sm">
                  <span className="text-green-400 text-lg">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mb-4 text-xs text-white/60">
              <p>Restricted: All trades, Analytics, PDF export, Streamer & Mentor mode</p>
            </div>
            <Button 
              onClick={() => handlePlanSelection('free')}
              className="w-full button-3d bg-transparent border-white/40 text-white hover:bg-white/10 font-semibold"
            >
              {user ? 'Continue with Free' : 'Get Started'}
            </Button>
          </div>

          {/* Cooked */}
          <div className="plan-card plan-card-cooked p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white mb-4">Cooked</h4>
            <div className="text-2xl font-bold text-white mb-2">Indian users <span className="text-purple-300">₹29/mo</span></div>
            <div className="text-2xl font-bold text-white mb-6">International users <span className="text-purple-300">$29/mo</span></div>
            <ul className="space-y-3 mb-8 text-left">
              {[
                "All free plan features",
                "All trades dashboard access",
                "Complete analytics dashboard",
                "Advanced psychology section",
                "3 images upload per trade",
                "Streamer mode access"
              ].map((feature, i) => (
                <li key={i} className="text-white/80 flex items-center gap-2 text-sm">
                  <span className="text-purple-400 text-lg">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mb-4 text-xs text-white/60">
              <p>Restricted: PDF export, Advanced risk/performance/time analysis, Mentor mode</p>
            </div>
            <Button 
              onClick={() => handlePlanSelection('cooked')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 font-semibold border-none"
            >
              {user ? 'Upgrade to Cooked' : 'Choose Cooked'}
            </Button>
          </div>

          {/* Goated */}
          <div className="plan-card plan-card-goated p-8 text-center rounded-2xl">
            <h4 className="text-2xl font-bold text-white mb-4">Goated</h4>
            <div className="text-2xl font-bold text-white mb-2">Indian users <span className="text-yellow-400">₹49/mo</span></div>
            <div className="text-2xl font-bold text-white mb-6">International users <span className="text-yellow-400">$49/mo</span></div>
            <ul className="space-y-3 mb-8 text-left">
              {[
                "All Cooked plan features",
                "Complete advanced analytics",
                "Risk & performance analysis",
                "Time analysis dashboard",
                "PDF export functionality",
                "Unlimited image uploads",
                "Full mentor mode access",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="text-white/80 flex items-center gap-2 text-sm">
                  <span className="text-yellow-400 text-lg">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mb-4 text-xs text-white/60">
              <p>No restrictions - Full access to all features</p>
            </div>
            <Button 
              onClick={() => handlePlanSelection('goated')}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold border-none"
            >
              {user ? 'Go Goated' : 'Choose Goated'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
