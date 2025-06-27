
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UploadedImagesGridProps {
  imageUrls: string[];
  onDelete: (imageUrl: string) => void;
}

const UploadedImagesGrid = ({ imageUrls, onDelete }: UploadedImagesGridProps) => {
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {imageUrls.map((url) => (
        <div key={url} className="relative group">
          <img
            src={url}
            alt="Trade screenshot"
            className="rounded-md object-cover w-full h-24"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(url)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default UploadedImagesGrid;
