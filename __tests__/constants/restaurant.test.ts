import {
  RESTAURANT_INFO,
  OPENING_HOURS,
  TIME_SLOTS,
} from "@/app/constants/restaurant";

describe("Restaurant Constants", () => {
  describe("RESTAURANT_INFO", () => {
    it("should have correct restaurant name", () => {
      expect(RESTAURANT_INFO.name).toBe("Vesuvius");
    });

    it("should have valid contact information", () => {
      expect(RESTAURANT_INFO.contact.phone).toMatch(/^\+45/);
      expect(RESTAURANT_INFO.contact.email).toContain("@");
    });

    it("should have correct capacity calculations", () => {
      expect(RESTAURANT_INFO.totalCapacity).toBe(
        RESTAURANT_INFO.tablesCount * RESTAURANT_INFO.seatsPerTable
      );
    });
  });

  describe("OPENING_HOURS", () => {
    it("should have 7 days", () => {
      expect(OPENING_HOURS).toHaveLength(7);
    });

    it("should have Monday as closed", () => {
      const monday = OPENING_HOURS.find((day) => day.day === "Mandag");
      expect(monday?.hours).toBe("LUKKET");
    });
  });

  describe("TIME_SLOTS", () => {
    it("should have valid time format", () => {
      // Test at alle tider er i HH:MM format
      TIME_SLOTS.forEach((slot) => {
        expect(slot).toMatch(/^\d{2}:\d{2}$/);
      });
    });

    it("should start with 11:00", () => {
      expect(TIME_SLOTS[0]).toBe("11:00");
    });
  });
});
