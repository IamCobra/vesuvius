import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => require("next-router-mock"));

// Mock fetch globally
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
