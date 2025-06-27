
import { TabsContent } from "@/components/ui/tabs";
import TradeImport from "@/components/trading/TradeImport";
import { Trade } from "@/types/trade";

interface ImportTabProps {
  trades: Trade[];
  onImport: (trades: Trade[]) => void;
  onDeleteAll: () => void;
}

const ImportTab = ({ trades, onImport, onDeleteAll }: ImportTabProps) => {
  return (
    <TabsContent value="import">
      <TradeImport 
        onImport={onImport} 
        onDeleteAll={onDeleteAll}
        trades={trades} 
      />
    </TabsContent>
  );
};

export default ImportTab;
