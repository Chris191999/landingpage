import { Trade } from "@/types/trade";
import { useState } from "react";
import ImageViewerModal from "./image-viewer/ImageViewerModal";

interface TradeDetailContentProps {
  trade: Trade;
}

const TradeDetailContent = ({ trade }: TradeDetailContentProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex-grow space-y-6 overflow-y-auto pr-4">
        {trade.notes && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-orange-400">Trade Notes</h3>
            <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
              <p className="whitespace-pre-wrap">{trade.notes}</p>
            </div>
          </div>
        )}

        {trade.post_trade_reflection && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-orange-400">Post-Trade Reflection</h3>
            <div className="bg-gray-800 p-3 rounded text-sm text-gray-300">
              <p className="whitespace-pre-wrap">{trade.post_trade_reflection}</p>
            </div>
          </div>
        )}

        {trade.image_files && trade.image_files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-orange-400">Trade Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trade.image_files.map((url, index) => (
                <button
                  key={url}
                  onClick={() => openImageViewer(index)}
                  className="overflow-hidden rounded-md group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <img
                    src={url}
                    alt="Trade screenshot"
                    className="rounded-md object-cover w-full h-32 group-hover:opacity-80 group-hover:scale-105 transition-all duration-200"
                    onError={(e) => { e.currentTarget.src = '/public/placeholder.svg'; }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {trade.image_files && trade.image_files.length > 0 && (
        <ImageViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          imageUrls={trade.image_files}
          startIndex={selectedImageIndex}
        />
      )}
    </>
  );
};

export default TradeDetailContent;

