
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ConfirmationMenuItemProps {
  triggerText: string;
  dialogTitle: string;
  dialogDescription: string;
  confirmButtonText?: string;
  confirmButtonClassName?: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
}

const ConfirmationMenuItem = ({
  triggerText,
  dialogTitle,
  dialogDescription,
  confirmButtonText = "Confirm",
  confirmButtonClassName,
  onConfirm,
  disabled = false,
  className,
}: ConfirmationMenuItemProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          disabled={disabled}
          className={className}
        >
          {triggerText}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={confirmButtonClassName}
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationMenuItem;
