
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import JSZip from 'jszip';
import { parseCsvData } from "./utils/csvParser";
import { processAndUploadImages } from "./utils/imageProcessor";
import { validateZipFile, findAndValidateCsv } from "./utils/zipValidator";
import SecurityInfoDisplay from "./components/SecurityInfoDisplay";
import { useAuth } from "@/hooks/useAuth";

interface ImportZipHandlerProps {
  onImport: (trades: Trade[]) => void;
}

const ImportZipHandler = ({ onImport }: ImportZipHandlerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityInfo, setSecurityInfo] = useState<{
    filesProcessed: number;
    imagesFound: number;
    securityWarnings: string[];
  } | null>(null);

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const zipValidation = validateZipFile(file);
    if (!zipValidation.isValid) {
      toast({
        title: "Security Error",
        description: zipValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to import data.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    let filesProcessed = 0;
    const allWarnings: string[] = [];
    let totalImagesFound = 0;
    let totalImagesUploaded = 0;

    try {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);
      
      const { csvContent, warnings: csvWarnings } = await findAndValidateCsv(zipContent);
      filesProcessed++;
      allWarnings.push(...csvWarnings);

      const tradesFromCsv = parseCsvData(csvContent);
      const finalTrades: Trade[] = [];

      for (const trade of tradesFromCsv) {
        const tradeWithId = { ...trade, id: trade.id || crypto.randomUUID() };

        const result = await processAndUploadImages(tradeWithId, zipContent, user.id);
        
        finalTrades.push(result.tradeWithImageUrls);
        allWarnings.push(...result.warnings);
        totalImagesFound += result.imagesFound;
        totalImagesUploaded += result.imagesUploaded;
      }
      
      filesProcessed += totalImagesFound;
      
      setSecurityInfo({
        filesProcessed,
        imagesFound: totalImagesFound,
        securityWarnings: allWarnings,
      });
      
      onImport(finalTrades);

      toast({
        title: "Complete Backup Restored",
        description: `Successfully restored ${finalTrades.length} trades with all comprehensive data. Found ${totalImagesFound} images, uploaded ${totalImagesUploaded} new images.`,
      });
      
    } catch (error) {
      console.error('Zip import error:', error);
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to process complete backup file safely",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 dark:bg-green-900/20 p-2 rounded">
        <Shield className="h-4 w-4" />
        <span>Secure complete backup restore: Full validation, size limits, and encrypted storage</span>
      </div>

      <div>
        <Label htmlFor="zip-file">Upload Complete Backup ZIP File (Max 50MB)</Label>
        <Input
          id="zip-file"
          type="file"
          accept=".zip,application/zip"
          onChange={handleZipUpload}
          className="mt-1"
          disabled={isProcessing}
        />
        <p className="text-sm text-muted-foreground mt-1">
          {isProcessing ? "Restoring complete backup securely..." : "Upload your complete trading data backup ZIP file"}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Complete Backup Restore Features:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Restores ALL trade data (60+ comprehensive fields)</li>
          <li>• Full psychological analysis data restoration</li>
          <li>• Complete market context and advanced metrics</li>
          <li>• All trade images with proper cloud storage</li>
          <li>• Strategy, setup, and session data</li>
          <li>• Perfect compatibility with all tabs (Overview, Analytics, Advanced)</li>
        </ul>
      </div>

      {securityInfo && <SecurityInfoDisplay securityInfo={securityInfo} />}
    </div>
  );
};

export default ImportZipHandler;
