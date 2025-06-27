
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useTradeImages = (tradeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to upload images.', variant: 'destructive' });
      return [];
    }
    if (!tradeId) {
        toast({ title: 'Error', description: 'A trade must be saved before adding images.', variant: 'destructive' });
        return [];
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `${user.id}/${tradeId}/${fileName}`;

      const { error } = await supabase.storage
        .from('trade_images')
        .upload(filePath, file);

      if (error) {
        toast({ title: 'Upload Error', description: error.message, variant: 'destructive' });
        console.error('Upload error:', error);
      } else {
        const { data } = supabase.storage
          .from('trade_images')
          .getPublicUrl(filePath);
        if (data.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }
    }

    setIsUploading(false);
    if (uploadedUrls.length > 0) {
      toast({ title: 'Success', description: `${uploadedUrls.length} image(s) uploaded.` });
      await queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
    return uploadedUrls;
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to delete images.', variant: 'destructive' });
      return false;
    }
    
    try {
      const url = new URL(imageUrl);
      const pathName = url.pathname;
      const bucketName = 'trade_images';
      const filePath = decodeURIComponent(pathName.substring(pathName.indexOf(`/${bucketName}/`) + `/${bucketName}/`.length));

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        toast({ title: 'Delete Error', description: error.message, variant: 'destructive' });
        console.error('Delete error:', error);
        return false;
      } else {
        toast({ title: 'Success', description: 'Image deleted.' });
        await queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
        await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        return true;
      }
    } catch(e) {
      console.error("Error parsing URL or deleting image", e);
      toast({ title: 'Error', description: 'Could not delete image.', variant: 'destructive' });
      return false;
    }
  };

  return { isUploading, uploadImages, deleteImage };
};
