import { formatPrice } from "@/app/utils/helpers";

describe("Helper Functions", () => {
  describe("formatPrice", () => {
    it("should format price correctly", () => {
      expect(formatPrice(100)).toBe("100 kr.");
    });
  });
});
