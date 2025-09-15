// Utility function til at formatere pris
export function formatPrice(price: number): string {
  return `${price} kr.`;
}

// Utility function til at validere email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function til at beregne total pris
export function calculateTotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
