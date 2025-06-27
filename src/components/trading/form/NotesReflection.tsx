
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trade } from "@/types/trade";
import ImageUploader from "./ImageUploader";
import UploadedImagesGrid from "./UploadedImagesGrid";
import { useTradeImages } from "@/hooks/useTradeImages";

interface NotesReflectionProps {
  formData: Partial<Trade>;
  onFieldChange: (field: keyof Trade, value: any) => void;
}

const NotesReflection = ({ formData, onFieldChange }: NotesReflectionProps) => {
  const tradeId = formData.id || '';
  const { isUploading, uploadImages, deleteImage } = useTradeImages(tradeId);

  const handleImageUpload = async (files: File[]) => {
    const newUrls = await uploadImages(files);
    if (newUrls.length > 0) {
      const updatedImageFiles = [...(formData.image_files || []), ...newUrls];
      onFieldChange('image_files', updatedImageFiles);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    const success = await deleteImage(imageUrl);
    if (success) {
      const updatedImageFiles = (formData.image_files || []).filter(url => url !== imageUrl);
      onFieldChange('image_files', updatedImageFiles);
    }
  };

  const handleImagesChange = (images: string[]) => {
    onFieldChange('image_files', images);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Notes, Reflection & Images</h3>
      
      <div className="space-y-4">
        {/* Trade Notes Section */}
        <div>
          <Label htmlFor="notes" className="text-white mb-2 block">Trade Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder="Enter your trade analysis, thoughts, and observations here."
            rows={4}
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Press Ctrl+Enter to submit form</p>
        </div>

        {/* Post-Trade Reflection */}
        <div>
          <Label htmlFor="post_trade_reflection" className="text-white mb-2 block">Post-Trade Reflection</Label>
          <Textarea
            id="post_trade_reflection"
            value={formData.post_trade_reflection || ''}
            onChange={(e) => onFieldChange('post_trade_reflection', e.target.value)}
            placeholder="What went well? What could be improved? Key lessons..."
            rows={3}
            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-400 resize-none"
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
            <ImageUploader 
              images={formData.image_files || []} 
              onImagesChange={handleImagesChange} 
            />
            <UploadedImagesGrid imageUrls={formData.image_files || []} onDelete={handleImageDelete} />
        </div>
      </div>
    </div>
  );
};

export default NotesReflection;
