import { supabase } from '../client';
export const addTradeTypeColumn = async () => {
  const { error } = await supabase.rpc('add_trade_type_column' as any);
  if (error) {
    console.error('Error adding trade_type column:', error);
    throw error;
  }
}; 