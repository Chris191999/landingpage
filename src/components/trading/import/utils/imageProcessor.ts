
import JSZip from 'jszip';
import { Trade } from "@/types/trade";
import { supabase } from '@/integrations/supabase/client';

export interface ImageProcessingResult {
  tradeWithImageUrls: Trade;
  imagesFound: number;
  imagesUploaded: number;
  warnings: string[];
}

const BUCKET_NAME = 'trade_images';

export const processAndUploadImages = async (
  trade: Trade,
  zipContent: JSZip,
  userId: string
): Promise<ImageProcessingResult> => {
  const warnings: string[] = [];
  let imagesFound = 0;
  let imagesUploaded = 0;
  const publicUrls: string[] = [];

  const imageFilenames = Array.isArray(trade.image_files)
    ? trade.image_files
    : typeof trade.image_files === 'string'
    ? (trade.image_files as string).split(';').filter(name => name)
    : [];

  if (imageFilenames.length === 0) {
    return { 
      tradeWithImageUrls: { ...trade, image_files: [] }, 
      imagesFound: 0, 
      imagesUploaded: 0, 
      warnings: [] 
    };
  }

  for (const filename of imageFilenames) {
    const imagePathInZip = `images/${filename}`;
    const imageFile = zipContent.files[imagePathInZip];

    if (!imageFile) {
      warnings.push(`Image file not found in zip: ${filename}`);
      continue;
    }

    imagesFound++;

    const imageBlob = await imageFile.async('blob');
    if (imageBlob.size > 5 * 1024 * 1024) {
      warnings.push(`Image ${filename} is too large (>5MB), skipped`);
      continue;
    }

    const file = new File([imageBlob], filename, { type: imageBlob.type });
    const filePath = `${userId}/${trade.id}/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (error && error.message !== 'The resource already exists') {
      warnings.push(`Failed to upload ${filename}: ${error.message}`);
      continue;
    }

    if (!error) {
      imagesUploaded++;
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    if (data.publicUrl) {
      publicUrls.push(data.publicUrl);
    } else {
      warnings.push(`Could not get public URL for ${filename}`);
    }
  }

  return {
    tradeWithImageUrls: { ...trade, image_files: publicUrls },
    imagesFound,
    imagesUploaded,
    warnings,
  };
};
