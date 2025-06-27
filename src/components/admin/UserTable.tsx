
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import AddUserDialog from "@/components/admin/AddUserDialog";
import UserActions from "./UserActions";
import PlanManagementDialog from "./PlanManagementDialog";
import type { ProfileWithEmail } from "@/hooks/useAdminUsers";
import { Database } from "@/integrations/supabase/types";
import { formatBytes } from "@/utils/formatters";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserTableProps {
  profiles: ProfileWithEmail[];
  onUpdateUser: (id: string, updates: { status?: Profile['status'], role?: Profile['role'] }) => void;
  onUpdatePlan: (userId: string, planData: {
    plan: string;
    activated_at: string;
    expires_at: string;
  }) => void;
  onDeleteUser: (profile: ProfileWithEmail) => void;
  onDeleteUserData: (profile: ProfileWithEmail) => void;
}

type SortField = 'plan' | 'status' | 'role' | 'storage_used';
type SortDirection = 'asc' | 'desc';

const UserTable = ({ profiles, onUpdateUser, onUpdatePlan, onDeleteUser, onDeleteUserData }: UserTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Let him cook (free)':
        return 'bg-gray-500';
      case 'Cooked':
        return 'bg-purple-500';
      case 'Goated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-500" /> : 
      <ChevronDown className="h-4 w-4 text-blue-500" />;
  };

  const sortedProfiles = profiles ? [...profiles].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'plan':
        aValue = a.plan || '';
        bValue = b.plan || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'role':
        aValue = a.role || '';
        bValue = b.role || '';
        break;
      case 'storage_used':
        aValue = a.storage_used || 0;
        bValue = b.storage_used || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  }) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <AddUserDialog />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {getSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('plan')}
                >
                  <div className="flex items-center gap-1">
                    Plan
                    {getSortIcon('plan')}
                  </div>
                </TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('storage_used')}
                >
                  <div className="flex items-center gap-1">
                    Storage Used
                    {getSortIcon('storage_used')}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProfiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.full_name || "N/A"}</TableCell>
                  <TableCell>{profile.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>{profile.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        profile.status === 'active'
                          ? 'success'
                          : profile.status === 'pending_approval'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPlanColor(profile.plan || '')} text-white`}>
                      {profile.plan || 'Free'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(profile.activated_at || null)}</TableCell>
                  <TableCell>{formatDate(profile.expires_at || null)}</TableCell>
                  <TableCell>{formatBytes(profile.storage_used || 0)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <PlanManagementDialog 
                        profile={profile} 
                        onUpdatePlan={onUpdatePlan}
                      />
                      <UserActions 
                        profile={profile} 
                        onUpdate={onUpdateUser} 
                        onDelete={onDeleteUser} 
                        onDeleteData={onDeleteUserData} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
