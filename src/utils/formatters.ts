
// Format currency to Thai Baht
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('฿', '');
};

// Format date to Thai format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format short date (DD/MM/YYYY)
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Calculate days between two dates
export const daysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Convert days to months and days
export const daysToMonths = (days: number): { months: number, remainingDays: number } => {
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return { months, remainingDays };
};

// Check if warranty is active
export const isWarrantyActive = (endDate: string): boolean => {
  const end = new Date(endDate);
  const today = new Date();
  return end >= today;
};

// Calculate warranty status text and color
export const getWarrantyStatus = (endDate: string): { text: string; color: string } => {
  const isActive = isWarrantyActive(endDate);
  const days = daysBetween(new Date().toISOString(), endDate);
  
  if (isActive) {
    return {
      text: `กำลังรับประกัน (เหลือ ${days} วัน)`,
      color: 'text-success'
    };
  } else {
    return {
      text: 'หมดประกัน',
      color: 'text-destructive'
    };
  }
};

// Calculate days from start date to current date
export const daysFromStart = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Generate PDF filename
export const generatePdfFilename = (prefix: string, invoiceNumber: string): string => {
  return `${prefix}_${invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
};
