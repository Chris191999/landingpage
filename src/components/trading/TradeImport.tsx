
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { Upload, Download, Trash2, FileText } from "lucide-react";
import ImportZipHandler from "./import/ImportZipHandler";
import ExportDataHandler from "./import/ExportDataHandler";
import DeleteDataHandler from "./import/DeleteDataHandler";
import CsvImportHandler from "./import/CsvImportHandler";
import PdfExportHandler from "./import/PdfExportHandler";

interface TradeImportProps {
  onImport: (trades: Trade[]) => void;
  onDeleteAll: () => void;
  trades: Trade[];
}

const TradeImport = ({ onImport, onDeleteAll, trades }: TradeImportProps) => {
  const sampleCsv = `symbol,direction,date,status,test_type,order_type,entry,exit,quantity,risk,planned_vs_actual_pnl,fees,market_condition,order_liq,liq_entry_breakeven_risk,pnducm_imbalance,entry_liq,liquidity,notes,id,image_files,pnl,emotion,confidence_rating,mistake_category,rules_followed,post_trade_reflection,market_condition_detailed,time_of_day,economic_events,market_volatility,trade_duration_hours,max_adverse_excursion,max_favorable_excursion,slippage,commission_breakdown,setup_type,strategy_name,timeframe,trade_type,position_size,stop_loss,trailing_stop,account_balance,account_name,session
AAPL,Long,2024-01-15,Completed,Swing,Market,150.00,155.00,100,100,500,2.50,Bullish,High,Good,Low,High,Excellent,Great breakout trade,1,d290f1ee-6c54-4b01-90e6-d701748f0851.png;f47ac10b-58cc-4372-a567-0e02b2c3d479.png,500,confident,8,none,true,Excellent execution following the plan,trending_up,09:30,FOMC,medium,24,50,200,0.05,"entry:1.25,exit:1.25",breakout,momentum,1d,swing,10000,149.50,151.00,50000,Main Account,US Session
TSLA,Short,2024-01-16,Completed,Day,Limit,200.00,195.00,50,150,750,3.00,Bearish,Medium,Fair,High,Medium,Good,Good resistance rejection,2,9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.png,750,disciplined,9,none,true,Perfect short at resistance level,trending_down,14:15,Earnings,high,4,25,300,0.10,"entry:1.50,exit:1.50",resistance,reversal,1h,day,5000,201.00,193.00,49000,Main Account,US Session`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Import Complete Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImportZipHandler onImport={onImport} />
            <div className="border-t pt-4">
              <CsvImportHandler onImport={onImport} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Export Complete Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExportDataHandler trades={trades} />
          </CardContent>
        </Card>

        <PdfExportHandler trades={trades} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 size={20} />
              Delete All Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteDataHandler trades={trades} onDeleteAll={onDeleteAll} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Comprehensive CSV Format</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Your CSV format now supports complete comprehensive trade data including all psychological analysis, market context, advanced metrics, and strategy information (60+ fields):
          </p>
          <div className="bg-muted p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Complete Data Fields Include:</h4>
            <div className="text-sm text-muted-foreground space-y-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div>
                <strong>Basic Trade Data:</strong>
                <ul className="ml-2">
                  <li>• Symbol, Direction, Date, Status</li>
                  <li>• Entry, Exit, Quantity, Risk</li>
                  <li>• P&L, Fees, Order Types</li>
                </ul>
              </div>
              <div>
                <strong>Psychological Analysis:</strong>
                <ul className="ml-2">
                  <li>• Emotion, Confidence Rating</li>
                  <li>• Mistake Categories</li>
                  <li>• Rules Followed, Reflections</li>
                </ul>
              </div>
              <div>
                <strong>Market Context:</strong>
                <ul className="ml-2">
                  <li>• Market Conditions, Volatility</li>
                  <li>• Economic Events, Time of Day</li>
                  <li>• Liquidity, Imbalances</li>
                </ul>
              </div>
              <div>
                <strong>Advanced Metrics:</strong>
                <ul className="ml-2">
                  <li>• MAE, MFE, Trade Duration</li>
                  <li>• Slippage, Commission Breakdown</li>
                  <li>• Position Size, Stop Loss</li>
                </ul>
              </div>
              <div>
                <strong>Strategy & Setup:</strong>
                <ul className="ml-2">
                  <li>• Setup Type, Strategy Name</li>
                  <li>• Timeframe, Trade Type</li>
                  <li>• Account & Session Info</li>
                </ul>
              </div>
              <div>
                <strong>Technical Data:</strong>
                <ul className="ml-2">
                  <li>• Image Files, Created At</li>
                  <li>• User ID, Account Balance</li>
                  <li>• Trailing Stop, Account Name</li>
                </ul>
              </div>
            </div>
          </div>
          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
            {sampleCsv}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeImport;
