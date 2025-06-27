
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import JSZip from 'jszip';
import { sanitizeCsvCell } from "@/utils/security";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface ExportDataHandlerProps {
  trades: Trade[];
}

const ExportDataHandler = ({ trades }: ExportDataHandlerProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const filteredTrades = trades.filter(trade => {
    if (dateFrom && trade.date < dateFrom) return false;
    if (dateTo && trade.date > dateTo) return false;
    return true;
  });

  const handleExport = async () => {
    if (filteredTrades.length === 0) {
      toast({
        title: "Error",
        description: "No trades to export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      const zip = new JSZip();
      
      // Complete comprehensive headers including all new fields
      const headers = [
        'id', 'symbol', 'direction', 'date', 'status', 'test_type', 'order_type',
        'entry', 'exit', 'quantity', 'risk', 'planned_vs_actual_pnl', 'fees',
        'market_condition', 'order_liq', 'liq_entry_breakeven_risk', 'pnducm_imbalance',
        'entry_liq', 'liquidity', 'notes', 'image_files', 'pnl',
        'emotion', 'confidence_rating', 'mistake_category', 'rules_followed', 'post_trade_reflection',
        'market_condition_detailed', 'time_of_day', 'economic_events', 'market_volatility',
        'trade_duration_hours', 'max_adverse_excursion', 'max_favorable_excursion', 'slippage', 'commission_breakdown',
        'setup_type', 'strategy_name', 'timeframe', 'trade_type', 'position_size',
        'stop_loss', 'trailing_stop', 'account_balance', 'account_name', 'session',
        'created_at', 'user_id'
      ];
      
      const csvRows = [headers.join(',')];
      const imagesFolder = zip.folder('images');
      
      for (const trade of filteredTrades) {
        const imageFilenames: string[] = [];

        if (trade.image_files && trade.image_files.length > 0) {
          for (const imageUrl of trade.image_files) {
            try {
              const response = await fetch(imageUrl);
              if (!response.ok) {
                console.warn(`Failed to fetch image for export: ${imageUrl}`);
                continue;
              }
              const blob = await response.blob();
              const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
              imageFilenames.push(filename);
              imagesFolder?.file(filename, blob);
            } catch (e) {
              console.error(`Error fetching or adding image to zip ${imageUrl}:`, e);
            }
          }
        }

        const rowData = {
          ...trade,
          image_files: imageFilenames.join(';'),
        };

        const row = headers.map(header => {
          const key = header as keyof typeof rowData;
          const value = rowData[key];
          if (value === null || value === undefined) return '""';
          const sanitizedValue = sanitizeCsvCell(String(value));
          return `"${sanitizedValue.replace(/"/g, '""')}"`;
        });
        
        csvRows.push(row.join(','));
      }
      
      const csvContent = csvRows.join('\n');
      zip.file('trades.csv', csvContent);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading_data_complete_backup_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: `Complete trading data backup exported successfully with ${filteredTrades.length} trades and all associated data.`
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export complete trading data backup",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Export complete trading data backup as ZIP file with all comprehensive data fields, CSV, and images.
      </p>

      <div className="flex flex-wrap gap-4 items-end mb-2">
        <div>
          <label className="block text-xs mb-1">Date From</label>
          <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal"
              >
                {dateFrom ? format(new Date(dateFrom), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={dateFrom ? new Date(dateFrom) : undefined}
                onSelect={date => {
                  setDateFrom(date ? format(date, "yyyy-MM-dd") : undefined);
                  setDateFromOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-xs mb-1">Date To</label>
          <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal"
              >
                {dateTo ? format(new Date(dateTo), "yyyy-MM-dd") : <span className="text-muted-foreground">Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={dateTo ? new Date(dateTo) : undefined}
                onSelect={date => {
                  setDateTo(date ? format(date, "yyyy-MM-dd") : undefined);
                  setDateToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Complete Backup Export includes:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Complete trades.csv with ALL data fields (60+ columns)</li>
          <li>• All psychological analysis data (emotions, confidence, mistakes)</li>
          <li>• Complete market context (conditions, volatility, events)</li>
          <li>• Advanced metrics (MAE, MFE, slippage, duration)</li>
          <li>• Strategy & setup information</li>
          <li>• All trade images with proper filenames</li>
          <li>• Account & session data</li>
          <li>• Complete restore compatibility</li>
        </ul>
      </div>

      <Button 
        onClick={handleExport}
        disabled={filteredTrades.length === 0 || isExporting}
        className="w-full"
      >
        {isExporting ? "Creating Complete Backup..." : `Export Complete Backup (${filteredTrades.length} Trades)`}
      </Button>
    </div>
  );
};

export default ExportDataHandler;
