/**
 * Utility for Indian phone numbers & WhatsApp wa.me links
 */

/**
 * Normalizes an Indian phone number to standard 91XXXXXXXXXX format (without + or spaces)
 * for use in WhatsApp wa.me URLs.
 * 
 * Examples:
 * - "8770152422" -> "918770152422"
 * - "08770152422" -> "918770152422"
 * - "+91 87701 52422" -> "918770152422"
 * - "918770152422" -> "918770152422"
 */
export function formatIndianWhatsAppNumber(phone: string | undefined | null): string {
  if (!phone) return '919876543210';
  
  // Extract all digits
  let digits = phone.replace(/[^0-9]/g, '');

  // If starts with 0 (e.g. 08770152422), remove leading 0
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.substring(1);
  }

  // If 10 digits standard Indian mobile number, add 91 prefix
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // If already 12 digits starting with 91
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }

  // If starts with 91 and has more/less than 10 digits after
  if (!digits.startsWith('91') && digits.length > 0) {
    return `91${digits}`;
  }

  return digits || '919876543210';
}

/**
 * Creates a valid wa.me URL with auto +91 Indian country code and encoded text message.
 */
export function getWhatsAppUrl(phone: string | undefined | null, message?: string): string {
  const formattedNumber = formatIndianWhatsAppNumber(phone);
  if (message) {
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${formattedNumber}`;
}
