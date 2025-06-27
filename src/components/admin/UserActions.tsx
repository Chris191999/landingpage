
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileWithEmail } from "@/hooks/useAdminUsers";
import { Database } from "@/integrations/supabase/types";
import ConfirmationMenuItem from "./ConfirmationMenuItem";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserActionsProps {
  profile: ProfileWithEmail;
  onUpdate: (id: string, updates: { status?: Profile['status'], role?: Profile['role'] }) => void;
  onDelete: (profile: ProfileWithEmail) => void;
  onDeleteData: (profile: ProfileWithEmail) => void;
}

const UserActions = ({ profile, onUpdate, onDelete, onDeleteData }: UserActionsProps) => {
  const { user } = useAuth();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onUpdate(profile.id, { status: 'active' })}
          disabled={profile.status === 'active'}
        >
          Approve/Activate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdate(profile.id, { status: 'inactive' })}
          disabled={profile.status === 'inactive'}
        >
          Deactivate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onUpdate(profile.id, { role: 'admin' })}
          disabled={profile.role === 'admin'}
        >
          Promote to Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onUpdate(profile.id, { role: 'user' })}
          disabled={profile.role === 'user'}
        >
          Demote to User
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmationMenuItem
          triggerText="Delete All Data"
          dialogTitle="Are you absolutely sure?"
          dialogDescription={`This will permanently delete all data for user ${profile.full_name || profile.email}, including trades and images. This action cannot be undone.`}
          confirmButtonText="Yes, delete all data"
          onConfirm={() => onDeleteData(profile)}
          disabled={profile.id === user?.id}
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        />
        <ConfirmationMenuItem
          triggerText="Delete User"
          dialogTitle="Are you absolutely sure?"
          dialogDescription={`This will permanently delete the user account for ${profile.full_name || profile.email}. This requires the user to be inactive and have no associated data. This action cannot be undone.`}
          confirmButtonText="Yes, delete user"
          onConfirm={() => onDelete(profile)}
          disabled={profile.status !== 'inactive' || profile.id === user?.id}
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          confirmButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;
