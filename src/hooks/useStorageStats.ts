
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StorageStats {
  storageUsed: number;
  storageAvailable: number;
  totalFiles: number;
}

const fetchStorageStats = async (): Promise<StorageStats> => {
  const { data, error } = await supabase.functions.invoke<StorageStats>('get-storage-stats');

  if (error) {
    throw new Error(`Failed to fetch storage stats: ${error.message}`);
  }
  
  return data;
};

export const useStorageStats = () => {
  return useQuery<StorageStats, Error>({
    queryKey: ['storage-stats'],
    queryFn: fetchStorageStats,
  });
};
