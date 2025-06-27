
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Pencil, 
  MousePointer, 
  Eraser,
  Download
} from "lucide-react";

interface ImageViewerToolbarProps {
  tool: 'pan' | 'draw' | 'eraser';
  setTool: (tool: 'pan' | 'draw' | 'eraser') => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onClearDrawings: () => void;
  onDownload: () => void;
}

const ImageViewerToolbar = ({
  tool,
  setTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onClearDrawings,
  onDownload
}: ImageViewerToolbarProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap bg-muted p-2 rounded">
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          size="sm"
          variant={tool === 'pan' ? 'default' : 'outline'}
          onClick={() => setTool('pan')}
        >
          <MousePointer size={14} />
        </Button>
        <Button
          size="sm"
          variant={tool === 'draw' ? 'default' : 'outline'}
          onClick={() => setTool('draw')}
        >
          <Pencil size={14} />
        </Button>
      </div>
      
      <div className="flex items-center gap-1 border-r pr-2">
        <Button size="sm" variant="outline" onClick={onZoomIn}>
          <ZoomIn size={14} />
        </Button>
        <Button size="sm" variant="outline" onClick={onZoomOut}>
          <ZoomOut size={14} />
        </Button>
        <Button size="sm" variant="outline" onClick={onReset}>
          <RotateCcw size={14} />
        </Button>
        <span className="text-xs bg-background px-2 py-1 rounded">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {tool === 'draw' && (
        <div className="flex items-center gap-2 border-r pr-2">
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-8 h-8 rounded border cursor-pointer"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-xs">{brushSize}px</span>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" onClick={onClearDrawings}>
          <Eraser size={14} />
        </Button>
        <Button size="sm" variant="outline" onClick={onDownload}>
          <Download size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ImageViewerToolbar;
