
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import DashboardStats from "@/components/admin/DashboardStats";
import UserTable from "@/components/admin/UserTable";
import SubscriptionAnalytics from "@/components/admin/SubscriptionAnalytics";

const AdminDashboard = () => {
  const { profiles, isLoading, error, updateUser, updatePlan, deleteUser, deleteUserData } = useAdminUsers();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  const totalUsers = profiles?.length || 0;
  const activeUsers = profiles?.filter((p) => p.status === "active").length || 0;
  const pendingUsers = profiles?.filter((p) => p.status === "pending_approval").length || 0;
  const inactiveUsers = profiles?.filter((p) => p.status === "inactive").length || 0;

  return (
    <div className="container mx-auto p-4">
      <Link to="/">
        <Button variant="outline" className="mb-4">
          <ArrowLeft />
          Back to Web App
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <DashboardStats 
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        pendingUsers={pendingUsers}
        inactiveUsers={inactiveUsers}
      />

      {profiles && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Subscription Analytics</h2>
          <SubscriptionAnalytics profiles={profiles} />
        </div>
      )}

      {profiles && (
        <div className="mt-8">
          <UserTable 
            profiles={profiles}
            onUpdateUser={updateUser}
            onUpdatePlan={updatePlan}
            onDeleteUser={deleteUser}
            onDeleteUserData={deleteUserData}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
