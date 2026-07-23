import { applyVehicleFilters } from "../../frontend/src/utils/applyVehicleFilters";

describe("applyVehicleFilters", () => {
  it("should clear transmission when switching back to All", () => {
    const previous = {
      transmission: "Automatic",
      page: 1,
      limit: 9,
    };
    // Form submitted with Transmission = "All" (empty value stripped)
    const next = {};

    const result = applyVehicleFilters(previous, next);

    expect(result.transmission).toBeUndefined();
    expect(result.limit).toBe(9);
    expect(result.page).toBe(1);
  });

  it("should replace previous filters instead of merging them", () => {
    const previous = {
      category: "SUV",
      transmission: "Automatic",
      page: 2,
      limit: 9,
    };
    const next = { category: "Sedan" };

    const result = applyVehicleFilters(previous, next);

    expect(result.category).toBe("Sedan");
    expect(result.transmission).toBeUndefined();
    expect(result.page).toBe(1);
    expect(result.limit).toBe(9);
  });
});
