export function formatPrice(price: number): string {
  return `${price} kr.`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function calculateTotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
