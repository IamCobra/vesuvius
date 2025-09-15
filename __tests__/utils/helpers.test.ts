import { formatPrice, isValidEmail, calculateTotal } from "@/app/utils/helpers";

describe("Helper Functions", () => {
  describe("formatPrice", () => {
    it("should format price correctly", () => {
      expect(formatPrice(100)).toBe("100 kr.");
      expect(formatPrice(0)).toBe("0 kr.");
    });
  });

  describe("isValidEmail", () => {
    it("should validate emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("invalid")).toBe(false);
    });
  });

  describe("calculateTotal", () => {
    it("should calculate total correctly", () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];
      expect(calculateTotal(items)).toBe(250);
    });

    it("should return 0 for empty array", () => {
      expect(calculateTotal([])).toBe(0);
    });
  });
});
