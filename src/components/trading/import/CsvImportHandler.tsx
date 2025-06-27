
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { sanitizeCsvCell, sanitizeText } from "@/utils/security";
import { validateCsvImport, validateFileUpload, tradeValidationSchema } from "@/utils/validation";
import { AlertTriangle, Shield } from "lucide-react";

interface CsvImportHandlerProps {
  onImport: (trades: Trade[]) => void;
}

const CsvImportHandler = ({ onImport }: CsvImportHandlerProps) => {
  const { toast } = useToast();
  const [csvData, setCsvData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  const parseCsvData = (csvText: string): Trade[] => {
    // Validate CSV before processing
    const validation = validateCsvImport(csvText);
    if (!validation.isValid) {
      throw new Error(`CSV validation failed: ${validation.errors.join(', ')}`);
    }

    const lines = csvText.trim().split('\n');
    if (lines.length > 10000) {
      throw new Error('Too many rows in CSV (maximum 10,000 allowed)');
    }

    const headers = lines[0].split(',').map(h => sanitizeText(h.trim().replace(/"/g, '')));
    
    console.log('CSV Headers:', headers);
    
    const trades: Trade[] = [];
    const warnings: string[] = [];
    
    for (let i = 1; i < Math.min(lines.length, 10001); i++) {
      try {
        const values = lines[i].split(',').map(v => sanitizeCsvCell(v.trim().replace(/"/g, '')));
        const trade: Partial<Trade> = {};
        
        headers.forEach((header, index) => {
          const value = values[index] ? sanitizeText(values[index]) : '';
          
          switch (header.toLowerCase()) {
            case 'symbol':
              if (value && /^[A-Z0-9]{1,10}$/.test(value.toUpperCase())) {
                trade.symbol = value.toUpperCase();
              }
              break;
            case 'direction':
              if (value === 'Long' || value === 'Short') {
                trade.direction = value as 'Long' | 'Short';
              }
              break;
            case 'date':
              if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                trade.date = value;
              }
              break;
            case 'status':
              if (['Completed', 'Open', 'Cancelled'].includes(value)) {
                trade.status = value as 'Completed' | 'Open' | 'Cancelled';
              }
              break;
            case 'entry':
              const entryNum = parseFloat(value);
              if (!isNaN(entryNum) && entryNum > 0 && entryNum < 1000000) {
                trade.entry = entryNum;
              }
              break;
            case 'exit':
              const exitNum = parseFloat(value);
              if (!isNaN(exitNum) && exitNum >= 0 && exitNum < 1000000) {
                trade.exit = exitNum;
              }
              break;
            case 'risk':
              const riskNum = parseFloat(value);
              if (!isNaN(riskNum) && riskNum >= 0 && riskNum < 1000000) {
                trade.risk = riskNum;
              }
              break;
            case 'pnl':
              const pnlNum = parseFloat(value);
              if (!isNaN(pnlNum) && pnlNum > -1000000 && pnlNum < 1000000) {
                trade.pnl = pnlNum;
              }
              break;
            case 'fees':
              const feesNum = parseFloat(value);
              if (!isNaN(feesNum) && feesNum >= 0 && feesNum < 10000) {
                trade.fees = feesNum;
              }
              break;
            case 'notes':
              if (value && value.length <= 5000) {
                trade.notes = sanitizeText(value);
              }
              break;
            case 'confidence_rating':
              const confNum = parseInt(value);
              if (!isNaN(confNum) && confNum >= 1 && confNum <= 10) {
                trade.confidence_rating = confNum;
              }
              break;
            // Add other fields with similar validation...
            default:
              // Handle other fields safely
              if (value && value.length < 1000) {
                (trade as any)[header] = sanitizeText(value);
              }
              break;
          }
        });
        
        if (!trade.id) {
          trade.id = `imported_${Date.now()}_${i}`;
        }
        
        // Validate the complete trade object
        try {
          const validatedTrade = tradeValidationSchema.parse(trade);
          if (trade.symbol && trade.entry) {
            trades.push(validatedTrade as Trade);
          }
        } catch (validationError) {
          warnings.push(`Row ${i + 1}: Invalid data format`);
          console.warn(`Validation failed for row ${i + 1}:`, validationError);
        }
        
      } catch (error) {
        warnings.push(`Row ${i + 1}: Failed to parse`);
        console.error(`Error parsing line ${i + 1}:`, error);
      }
    }
    
    setSecurityWarnings(warnings);
    return trades;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file upload
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      toast({
        title: "Security Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    if (file.type === "text/csv" || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Please upload a valid CSV file",
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please provide CSV data to import",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSecurityWarnings([]);
    
    try {
      const trades = parseCsvData(csvData);
      
      if (trades.length === 0) {
        toast({
          title: "Error",
          description: "No valid trades found in the CSV data",
          variant: "destructive"
        });
        return;
      }
      
      onImport(trades);
      setCsvData("");
      
      toast({
        title: "Success",
        description: `Successfully imported ${trades.length} trades${securityWarnings.length > 0 ? ` (${securityWarnings.length} warnings)` : ''}`
      });
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Security Error",
        description: error instanceof Error ? error.message : "Failed to parse CSV data safely",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
        <Shield className="h-4 w-4" />
        <span>Enhanced security: File validation, input sanitization, and size limits active</span>
      </div>

      <div>
        <Label htmlFor="csv-file">Upload CSV File (Max 50MB)</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileUpload}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="csv-data">Or Paste CSV Data (Max 10MB)</Label>
        <Textarea
          id="csv-data"
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="Paste your CSV data here..."
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      {securityWarnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Import Warnings ({securityWarnings.length})
            </span>
          </div>
          <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
            {securityWarnings.slice(0, 5).map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
            {securityWarnings.length > 5 && (
              <li>• ... and {securityWarnings.length - 5} more warnings</li>
            )}
          </ul>
        </div>
      )}

      <Button 
        onClick={handleImport} 
        disabled={!csvData.trim() || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing Securely..." : "Import from CSV"}
      </Button>
    </div>
  );
};

export default CsvImportHandler;
