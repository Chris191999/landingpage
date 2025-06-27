
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Pencil } from "lucide-react";

interface ImageViewerControlsProps {
  zoomLevel: number;
  isDrawMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleDrawMode: () => void;
}

const ImageViewerControls = ({
  zoomLevel,
  isDrawMode,
  onZoomIn,
  onZoomOut,
  onToggleDrawMode
}: ImageViewerControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomOut}
        disabled={zoomLevel <= 0.5}
        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
      >
        <ZoomOut size={16} />
      </Button>
      
      <span className="text-sm text-gray-300 px-2 py-1">
        {Math.round(zoomLevel * 100)}%
      </span>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomIn}
        disabled={zoomLevel >= 3}
        className="bg-gray-700 hover:bg-gray-600 border-gray-600"
      >
        <ZoomIn size={16} />
      </Button>
      
      <Button
        size="sm"
        variant={isDrawMode ? "default" : "outline"}
        onClick={onToggleDrawMode}
        className={isDrawMode ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-700 hover:bg-gray-600 border-gray-600"}
      >
        <Pencil size={16} />
      </Button>
    </div>
  );
};

export default ImageViewerControls;
