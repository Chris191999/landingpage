
import { useEffect, useCallback } from 'react';
import { Trade } from '@/types/trade';

const STORAGE_KEY = 'trade_form_draft';
const DEBOUNCE_DELAY = 300; // Reduced for faster saving

export const useFormPersistence = (
  formData: Partial<Trade>,
  setFormData: (data: Partial<Trade>) => void,
  isEditing: boolean = false
) => {
  // Save form data to sessionStorage with debouncing
  const saveFormData = useCallback(() => {
    if (isEditing) return; // Don't persist when editing existing trades
    
    try {
      // Save any form data that exists, even partial entries
      const hasAnyData = formData.symbol?.trim() || 
                        formData.entry || 
                        formData.exit ||
                        formData.risk ||
                        formData.position_size ||
                        formData.pnl ||
                        formData.notes?.trim() ||
                        formData.fees ||
                        formData.slippage ||
                        formData.trade_type ||
                        formData.emotion ||
                        formData.confidence_rating ||
                        formData.mistake_category;
      
      if (hasAnyData) {
        console.log('Saving form data to sessionStorage:', formData);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } else {
        // Clear storage if no meaningful data
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [formData, isEditing]);

  // Restore form data from sessionStorage
  const restoreFormData = useCallback(() => {
    if (isEditing) return; // Don't restore when editing existing trades
    
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Restoring form data from sessionStorage:', parsedData);
        setFormData(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Failed to restore form data:', error);
    }
    return false;
  }, [setFormData, isEditing]);

  // Clear saved form data
  const clearSavedFormData = useCallback(() => {
    try {
      console.log('Clearing saved form data');
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, []);

  // Save data whenever form changes (with debouncing)
  useEffect(() => {
    if (isEditing) return;
    
    const timeoutId = setTimeout(saveFormData, DEBOUNCE_DELAY);
    return () => clearTimeout(timeoutId);
  }, [formData, saveFormData, isEditing]);

  // Save immediately when the page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isEditing) {
        saveFormData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isEditing) {
        saveFormData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveFormData, isEditing]);

  return {
    clearSavedFormData,
    restoreFormData
  };
};
