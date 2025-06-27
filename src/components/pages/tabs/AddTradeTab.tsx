import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import TradeForm from "@/components/trading/TradeForm";
import { Trade } from "@/types/trade";

interface AddTradeTabProps {
  selectedTrade: Trade | null;
  onSubmit: (trade: Trade) => void;
  onCancel: () => void;
  trades: any[];
}

const AddTradeTab = ({ selectedTrade, onSubmit, onCancel, trades }: AddTradeTabProps) => {
  return (
    <TabsContent value="add-trade">
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedTrade ? "Edit Trade" : "Add New Trade"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TradeForm 
            trade={selectedTrade}
            onSubmit={onSubmit}
            onCancel={onCancel}
            trades={trades}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AddTradeTab;
