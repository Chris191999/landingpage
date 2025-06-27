
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStorageStats } from "@/hooks/useStorageStats";
import { formatBytes } from "@/utils/formatters";

const CloudManagement = () => {
  const { data, isLoading, error } = useStorageStats();

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cloud Management</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Loading storage stats...</p>
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cloud Management</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">Error loading storage stats: {error.message}</p>
            </CardContent>
        </Card>
    );
  }

  const { storageUsed, storageAvailable, totalFiles } = data || { storageUsed: 0, storageAvailable: 0, totalFiles: 0 };
  const usagePercentage = storageAvailable > 0 ? (storageUsed / storageAvailable) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Storage Usage</h3>
          <p className="text-sm text-muted-foreground">
            {formatBytes(storageUsed)} of {formatBytes(storageAvailable)} used.
          </p>
          <Progress value={usagePercentage} className="mt-2" />
        </div>
        <div>
          <h3 className="text-lg font-medium">File Statistics</h3>
          <p className="text-sm text-muted-foreground">Total files: {totalFiles}</p>
          {totalFiles > 0 && (
             <p className="text-sm text-muted-foreground">
                Average file size: {formatBytes(storageUsed/totalFiles)}
             </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudManagement;
