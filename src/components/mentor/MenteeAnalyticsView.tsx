
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Trade } from '@/types/trade';
import { toast } from 'sonner';
import PerformanceMetrics from '@/components/trading/PerformanceMetrics';
import { Loader2 } from 'lucide-react';

interface MenteeAnalyticsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentee: any;
  accessLevel: 'basic' | 'advanced' | 'full';
  trades?: Trade[];
}

const MenteeAnalyticsView = ({ open, onOpenChange, mentee, accessLevel, trades: propTrades }: MenteeAnalyticsViewProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('MenteeAnalyticsView - Props trades:', propTrades);
    console.log('MenteeAnalyticsView - Access level:', accessLevel);
    console.log('MenteeAnalyticsView - Mentee:', mentee);
    
    if (propTrades) {
      console.log('Using prop trades:', propTrades.length);
      setTrades(propTrades);
      setLoading(false);
    } else if (open && mentee.id && (accessLevel === 'advanced' || accessLevel === 'full')) {
      console.log('Fetching mentee trades from database');
      fetchMenteeTrades();
    }
  }, [open, mentee.id, accessLevel, propTrades]);

  const fetchMenteeTrades = async () => {
    setLoading(true);
    try {
      console.log('Fetching trades for mentee ID:', mentee.id);
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', mentee.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching mentee trades:', error);
        throw error;
      }

      console.log('Fetched mentee trades:', data);
      setTrades(data as Trade[]);
    } catch (error: any) {
      console.error('Error fetching mentee trades:', error);
      toast.error('Failed to load mentee trading data');
    } finally {
      setLoading(false);
    }
  };

  if (accessLevel === 'basic') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-600">
              Analytics dashboard access requires Advanced or Full access level.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Analytics Dashboard - {mentee.full_name || mentee.email || 'Mentee'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 mx-auto mb-2" />
                <div className="text-gray-600">Loading analytics data...</div>
              </div>
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                No trading data available for this mentee.
              </div>
              <div className="text-sm text-gray-400">
                The mentee needs to add trades first to see analytics.
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">
                Showing analytics for {trades.length} trades
              </div>
              <PerformanceMetrics trades={trades} detailed={true} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenteeAnalyticsView;
