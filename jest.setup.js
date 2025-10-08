import "@testing-library/jest-dom";


jest.mock("next/navigation", () => require("next-router-mock"));


global.fetch = jest.fn();


beforeEach(() => {
  jest.clearAllMocks();
});
