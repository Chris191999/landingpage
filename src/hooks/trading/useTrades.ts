
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const useTrades = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch trades
    const { data: trades, isLoading: isLoadingTrades } = useQuery<Trade[]>({
        queryKey: ["trades", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("trades")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false });

            if (error) {
                toast.error(error.message);
                throw new Error(error.message);
            }
            return data as Trade[];
        },
        enabled: !!user,
    });

    // Add trade mutation
    const { mutate: addTrade } = useMutation({
        mutationFn: async (newTrade: Trade) => {
            if (!user) throw new Error("User not authenticated");
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { roi, winRate, rMultiple, ...tradeToInsert } = newTrade;
            
            const { data, error } = await supabase
                .from("trades")
                .insert([{ ...tradeToInsert, user_id: user.id }])
                .select()
                .single();
            
            if (error) {
                console.error("Error adding trade:", error);
                throw new Error(error.message);
            }
            return data as Trade;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades", user?.id] });
            toast.success("Trade added successfully!");
        },
        onError: (error) => {
            toast.error(`Error adding trade: ${error.message}`);
        },
    });

    // Update trade mutation
    const { mutate: updateTrade } = useMutation({
        mutationFn: async (updatedTrade: Trade) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, roi, winRate, rMultiple, ...updateData } = updatedTrade;
            const { data, error } = await supabase
                .from("trades")
                .update(updateData)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                console.error("Error updating trade:", error);
                throw new Error(error.message);
            }
            return data as Trade;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades", user?.id] });
            toast.success("Trade updated successfully!");
        },
        onError: (error) => {
            toast.error(`Error updating trade: ${error.message}`);
        },
    });

    // Delete trade mutation
    const { mutate: deleteTrade } = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("trades").delete().eq("id", id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades", user?.id] });
            toast.success("Trade deleted successfully!");
        },
        onError: (error) => {
            toast.error(`Error deleting trade: ${error.message}`);
        },
    });
    
    // Delete all trades mutation
    const { mutate: deleteAllTrades } = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("User not authenticated");
            const { error } = await supabase.functions.invoke('delete-all-user-data');
            if (error) {
              console.error("Error deleting all user data:", error);
              throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades", user?.id] });
            toast.success("All trades and images deleted successfully!");
        },
        onError: (error) => {
            toast.error(`Error deleting data: ${error.message}`);
        },
    });
    
    // Import trades (bulk insert/update)
    const { mutate: importTrades } = useMutation({
        mutationFn: async (importedTrades: Trade[]) => {
            if (!user) throw new Error("User not authenticated");
            const tradesToUpsert = importedTrades.map(trade => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { roi, winRate, rMultiple, ...tradeData } = trade;
                return {
                    ...tradeData,
                    user_id: user.id
                }
            });
            const { error } = await supabase.from("trades").upsert(tradesToUpsert, { onConflict: 'id' });
            if (error) {
                console.error("Error importing/upserting trades:", error);
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades", user?.id] });
            toast.success("Trades imported successfully!");
        },
        onError: (error) => {
            toast.error(`Error importing trades: ${error.message}`);
        },
    });

    return {
        trades,
        isLoadingTrades,
        addTrade,
        updateTrade,
        deleteTrade,
        deleteAllTrades,
        importTrades,
    };
};
