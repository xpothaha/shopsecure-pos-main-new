
/**
 * Generates a random product code with specified length
 * @param length The length of the product code (default: 8)
 * @returns A random product code with uppercase letters and numbers
 */
export function generateProductCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}
