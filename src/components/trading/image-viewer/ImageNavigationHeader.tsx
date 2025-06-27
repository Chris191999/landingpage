
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageNavigationHeaderProps {
  currentImageIndex: number;
  totalImages: number;
  onPrevImage: () => void;
  onNextImage: () => void;
}

const ImageNavigationHeader = ({
  currentImageIndex,
  totalImages,
  onPrevImage,
  onNextImage
}: ImageNavigationHeaderProps) => {
  if (totalImages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onPrevImage}
        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
      >
        <ChevronLeft size={16} />
      </Button>
      
      <span className="text-sm text-gray-300 px-2">
        {currentImageIndex + 1} / {totalImages}
      </span>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onNextImage}
        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default ImageNavigationHeader;
