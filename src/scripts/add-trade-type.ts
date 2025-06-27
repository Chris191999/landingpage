import { addTradeTypeColumn } from '../integrations/supabase/migrations/add-trade-type';

const runMigration = async () => {
  try {
    await addTradeTypeColumn();
    console.log('Successfully added trade_type column');
  } catch (error) {
    console.error('Failed to add trade_type column:', error);
  }
};

runMigration(); 