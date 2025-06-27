
import JSZip from 'jszip';
import { sanitizeText } from "@/utils/security";
import { validateFileUpload } from "@/utils/validation";

export interface ZipValidationResult {
  isValid: boolean;
  error?: string;
  warnings: string[];
}

export const validateZipFile = (file: File): ZipValidationResult => {
  const warnings: string[] = [];

  // Enhanced security validation
  const validation = validateFileUpload(file);
  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.errors.join(', '),
      warnings
    };
  }

  if (file.type !== "application/zip" && !file.name.endsWith('.zip')) {
    return {
      isValid: false,
      error: "Please upload a valid ZIP file",
      warnings
    };
  }

  return { isValid: true, warnings };
};

export const validateZipContent = (zipContent: JSZip): { warnings: string[]; csvFile: JSZip.JSZipObject | null; csvContent: string } => {
  const warnings: string[] = [];
  let csvFile = null;
  let csvContent = "";

  // Security check: limit number of files
  const fileCount = Object.keys(zipContent.files).length;
  if (fileCount > 1000) {
    throw new Error("ZIP contains too many files (maximum 1000 allowed)");
  }

  return { warnings, csvFile, csvContent };
};

export const findAndValidateCsv = async (zipContent: JSZip): Promise<{ csvContent: string; warnings: string[] }> => {
  const warnings: string[] = [];
  let csvFile = null;
  let csvContent = "";

  for (const filename of Object.keys(zipContent.files)) {
    // Security: Sanitize filename and check for directory traversal
    const sanitizedFilename = sanitizeText(filename);
    if (sanitizedFilename.includes('..') || sanitizedFilename.includes('/..')) {
      warnings.push(`Skipped suspicious file: ${filename}`);
      continue;
    }

    if (filename.endsWith('.csv') && !zipContent.files[filename].dir) {
      csvFile = zipContent.files[filename];
      csvContent = await csvFile.async('text');
      
      // Validate CSV size
      if (csvContent.length > 10 * 1024 * 1024) {
        throw new Error("CSV file too large (maximum 10MB)");
      }
      
      console.log('Found CSV file:', filename);
      break;
    }
  }

  if (!csvFile) {
    throw new Error("No valid CSV file found in the zip");
  }

  return { csvContent, warnings };
};
