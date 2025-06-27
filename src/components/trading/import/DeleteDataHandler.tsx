
import { Button } from "@/components/ui/button";
import { Trade } from "@/types/trade";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteDataHandlerProps {
  trades: Trade[];
  onDeleteAll: () => void;
}

const DeleteDataHandler = ({ trades, onDeleteAll }: DeleteDataHandlerProps) => {

  const handleDelete = () => {
    if (trades.length > 0) {
      onDeleteAll();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Permanently delete all trading data and associated images from cloud storage. This action cannot be undone.
      </p>
      
      <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
        <h4 className="font-medium mb-2 text-destructive">Warning:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Deletes all {trades.length} trades from the database</li>
          <li>• Removes all associated images from cloud storage</li>
          <li>• This action is irreversible</li>
        </ul>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            disabled={trades.length === 0}
            variant="destructive"
            className="w-full"
          >
            Delete All {trades.length} Trades
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your {trades.length} trades and all associated images from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteDataHandler;

