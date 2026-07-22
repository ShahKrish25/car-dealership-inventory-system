import Vehicle from "../models/vehicle.model";

describe("Vehicle Model", () => {
  it("should create and save a  vehicle successfully", async () => {
    const vehicle = new Vehicle({
      brand: "Hyundai",
      model: "Alcazar",
      year: 2022,
      price: 1600000,
      fuelType: "Diesel",
      transmission: "Automatic",
      mileage: 12,
      color: "Black",
    });
    const savedVehicle = await vehicle.save();
    expect(savedVehicle._id).toBeDefined();
    expect(savedVehicle.brand).toBe("Hyundai");
    expect(savedVehicle.model).toBe("Alcazar");
    expect(savedVehicle.price).toBe(1600000);
  });
});
