
import { z } from 'zod';
import { isValidDate } from './dateValidation';

// Trade form validation schema
export const tradeValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  symbol: z.string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be 10 characters or less")
    .regex(/^[A-Z0-9]+$/, "Symbol must contain only uppercase letters and numbers"),
  direction: z.enum(['Long', 'Short'], {
    errorMap: () => ({ message: "Direction must be either 'Long' or 'Short'" })
  }),
  date: z.string().refine(isValidDate, {
    message: "Date must be a valid date in YYYY-MM-DD format"
  }),
  status: z.enum(['Completed', 'Open', 'Cancelled']),
  entry: z.number()
    .min(0.01, "Entry price must be greater than 0")
    .max(1000000, "Entry price too large"),
  exit: z.number()
    .min(0, "Exit price must be positive")
    .max(1000000, "Exit price too large")
    .optional(),
  risk: z.number()
    .min(0, "Risk must be positive")
    .max(1000000, "Risk amount too large")
    .optional(),
  pnl: z.number()
    .min(-1000000, "P&L too low")
    .max(1000000, "P&L too high")
    .optional(),
  fees: z.number()
    .min(0, "Fees must be positive")
    .max(10000, "Fees too high")
    .optional(),
  notes: z.string()
    .max(5000, "Notes must be 5000 characters or less")
    .optional(),
  confidence_rating: z.number()
    .min(1, "Confidence rating must be between 1-10")
    .max(10, "Confidence rating must be between 1-10")
    .optional(),
  trade_duration_hours: z.number()
    .min(0, "Trade duration must be positive")
    .max(8760, "Trade duration cannot exceed 1 year")
    .optional()
});

// CSV import validation
export const validateCsvImport = (csvData: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check file size (limit to ~10MB of text)
  if (csvData.length > 10 * 1024 * 1024) {
    errors.push("CSV file too large (max 10MB)");
  }
  
  const lines = csvData.split('\n');
  
  // Limit number of rows
  if (lines.length > 10000) {
    errors.push("Too many rows (max 10,000)");
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i
  ];
  
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(csvData)
  );
  
  if (hasSuspiciousContent) {
    errors.push("CSV contains potentially malicious content");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// File upload validation
export const validateFileUpload = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // File size validation (50MB limit)
  if (!file || file.size > 50 * 1024 * 1024) {
    errors.push("File size must be less than 50MB");
  }
  
  // File type validation
  const allowedTypes = [
    'application/zip',
    'application/x-zip-compressed', // Added for wider zip file compatibility
    'text/csv',
    'application/vnd.ms-excel',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push("File type not allowed");
  }
  
  // File name validation
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
  const hasSuspiciousExtension = suspiciousExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (hasSuspiciousExtension) {
    errors.push("File extension not allowed");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
