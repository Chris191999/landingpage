
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import PlanUpgradePrompt from '@/components/common/PlanUpgradePrompt';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange }) => {
  const { toast } = useToast();
  const { data: planFeatures, isLoading: planLoading } = usePlanFeatures();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Handle unlimited images for Goated plan
  let maxImages = 1; // Default for free plan
  if (planFeatures) {
    if (planFeatures.max_images_per_trade === -1) {
      maxImages = -1; // Unlimited for Goated plan
    } else if (planFeatures.max_images_per_trade > 0) {
      maxImages = planFeatures.max_images_per_trade;
    }
  }
  
  const canUploadMore = maxImages === -1 || images.length < maxImages;
  const hasReachedLimit = !canUploadMore && maxImages !== -1;

  // Lossless compress image to PNG or WebP
  const compressImageLossless = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        // Use PNG for lossless, fallback to WebP if supported
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/png',
          1.0
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    
    // Check if adding these files would exceed the limit
    if (maxImages !== -1 && (images.length + files.length) > maxImages) {
      setShowUpgradePrompt(true);
      const requiredPlan = planFeatures?.plan_name === 'Let him cook (free)' ? 'Cooked' : 'Goated';
      toast({
        title: "Upload Limit Exceeded",
        description: `Your ${planFeatures?.plan_name} plan allows maximum ${maxImages} image${maxImages > 1 ? 's' : ''} per trade. Upgrade to ${requiredPlan} for more.`,
        variant: "destructive"
      });
      return;
    } else {
      setShowUpgradePrompt(false);
    }
    
    setUploading(true);
    setUploadProgress(0);
    toast({ title: 'Uploading images...', description: 'Your images are being uploaded.', duration: 2000 });
    
    try {
      // Optimistically show images as uploading
      let newImages: string[] = [];
      // Parallel upload and compress
      const uploadPromises = files.map(async (file, idx) => {
        // Lossless compress
        const compressedBlob = await compressImageLossless(file);
        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(compressedBlob);
        });
        const base64 = await base64Promise;
        // Progress update
        setUploadProgress(Math.round(((idx + 1) / files.length) * 100));
        return base64;
      });
      newImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImages]);
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image${files.length > 1 ? 's' : ''} added to trade`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  }, [images, onImagesChange, toast, maxImages, planFeatures?.plan_name]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const getRequiredPlan = () => {
    if (planFeatures?.plan_name === 'Let him cook (free)') return 'Cooked';
    return 'Goated';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Trade Images</h3>
            <div className="text-xs text-gray-500">
              {images.length}/{maxImages === -1 ? '∞' : maxImages} images
            </div>
          </div>

          {/* Upgrade prompt for exceeded limits */}
          {showUpgradePrompt && hasReachedLimit && (
            <div className="mb-4">
              <PlanUpgradePrompt 
                feature="Additional Image Uploads"
                requiredPlan={getRequiredPlan()}
                currentPlan={planFeatures?.plan_name}
                className="relative"
              />
            </div>
          )}

          {/* Upload button */}
          <div className="relative">
            {planLoading ? (
              <Button type="button" variant="outline" className="w-full cursor-wait opacity-50" disabled>
                Loading plan features...
              </Button>
            ) : canUploadMore ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    disabled={uploading}
                    asChild
                  >
                    <div className="flex items-center gap-2">
                      <Upload size={16} />
                      {uploading ? 'Uploading...' : 'Upload Images'}
                    </div>
                  </Button>
                </label>
                {uploading && (
                  <div className="w-full mt-2 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-not-allowed opacity-50"
                disabled
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Upload Limit Reached
                </div>
              </Button>
            )}
          </div>

          {/* Image grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Trade image ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Plan info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>{planFeatures?.plan_name}:</strong> {
              maxImages === -1 
                ? 'Unlimited image uploads' 
                : `Up to ${maxImages} image${maxImages > 1 ? 's' : ''} per trade`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
