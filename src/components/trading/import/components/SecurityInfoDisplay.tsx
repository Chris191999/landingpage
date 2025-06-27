
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityInfo {
  filesProcessed: number;
  imagesFound: number;
  securityWarnings: string[];
}

interface SecurityInfoDisplayProps {
  securityInfo: SecurityInfo;
}

const SecurityInfoDisplay = ({ securityInfo }: SecurityInfoDisplayProps) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Import Security Summary
        </span>
      </div>
      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
        <li>• Files processed: {securityInfo.filesProcessed}</li>
        <li>• Images imported: {securityInfo.imagesFound}</li>
        <li>• Security warnings: {securityInfo.securityWarnings.length}</li>
      </ul>
      {securityInfo.securityWarnings.length > 0 && (
        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
          <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Warnings:</span>
          <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {securityInfo.securityWarnings.slice(0, 3).map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
            {securityInfo.securityWarnings.length > 3 && (
              <li>• ... and {securityInfo.securityWarnings.length - 3} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecurityInfoDisplay;
