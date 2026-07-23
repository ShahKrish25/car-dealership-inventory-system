import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import Vehicle from "../models/vehicle.model";

describe("Vehicle Routes", () => {
  const adminToken = jwt.sign(
    { id: "123", role: "admin" },
    process.env.JWT_SECRET as string
  );

  const userToken = jwt.sign(
    { id: "456", role: "user" },
    process.env.JWT_SECRET as string
  );

  it("should get all vehicles publicly", async () => {
    await Vehicle.create({
      brand: "Honda",
      model: "City",
      category: "Sedan",
      year: 2021,
      price: 1200000,
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: 22000,
      color: "White",
      quantity: 3,
    });

    const res = await request(app).get("/api/vehicles");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  it("should allow admin to create a vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        brand: "Toyota",
        model: "Innova",
        category: "MPV",
        year: 2023,
        price: 2500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 10000,
        color: "Silver",
        quantity: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.category).toBe("MPV");
    expect(res.body.quantity).toBe(5);
  });

  it("should block normal user from creating a vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        brand: "Toyota",
        model: "Innova",
        category: "MPV",
        year: 2023,
        price: 2500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 10000,
        color: "Silver",
        quantity: 5,
      });

    expect(res.status).toBe(403);
  });

  it("should allow admin to update a vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Hyundai",
      model: "Creta",
      category: "SUV",
      year: 2020,
      price: 1500000,
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: 18000,
      color: "Blue",
      quantity: 4,
    });

    const res = await request(app)
      .put(`/api/vehicles/${vehicle._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 1600000 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(1600000);
  });

  it("should allow admin to delete a vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Mahindra",
      model: "XUV700",
      category: "SUV",
      year: 2022,
      price: 2200000,
      fuelType: "Diesel",
      transmission: "Automatic",
      mileage: 12000,
      color: "Red",
      quantity: 2,
    });

    const res = await request(app)
      .delete(`/api/vehicles/${vehicle._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vehicle deleted successfully");
  });

  it("should paginate vehicles with page and limit", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
      {
        brand: "Hyundai",
        model: "Creta",
        category: "SUV",
        year: 2020,
        price: 1800000,
        fuelType: "Petrol",
        transmission: "Automatic",
        mileage: 18000,
        color: "Blue",
        quantity: 1,
      },
    ]);

    const res = await request(app).get("/api/vehicles?page=1&limit=2");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.total).toBe(3);
    expect(res.body.page).toBe(1);
    expect(res.body.pages).toBe(2);
  });

  it("should return second page of paginated vehicles", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
      {
        brand: "Hyundai",
        model: "Creta",
        category: "SUV",
        year: 2020,
        price: 1800000,
        fuelType: "Petrol",
        transmission: "Automatic",
        mileage: 18000,
        color: "Blue",
        quantity: 1,
      },
    ]);

    const res = await request(app).get("/api/vehicles?page=2&limit=2");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.page).toBe(2);
    expect(res.body.pages).toBe(2);
  });

  it("should allow a logged-in user to purchase a vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Toyota",
      model: "Fortuner",
      category: "SUV",
      year: 2022,
      price: 3500000,
      fuelType: "Diesel",
      transmission: "Automatic",
      mileage: 15000,
      color: "Black",
      quantity: 3,
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vehicle purchased successfully");
    expect(res.body.vehicle.quantity).toBe(2);
  });

  it("should return 400 when purchasing an out-of-stock vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Honda",
      model: "City",
      category: "Sedan",
      year: 2021,
      price: 1200000,
      fuelType: "Petrol",
      transmission: "Manual",
      mileage: 22000,
      color: "White",
      quantity: 0,
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Vehicle out of stock");
  });

  it("should allow admin to restock a vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Hyundai",
      model: "Creta",
      category: "SUV",
      year: 2020,
      price: 1800000,
      fuelType: "Petrol",
      transmission: "Automatic",
      mileage: 18000,
      color: "Blue",
      quantity: 1,
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 4 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vehicle restocked successfully");
    expect(res.body.vehicle.quantity).toBe(5);
  });

  it("should block normal user from restocking a vehicle", async () => {
    const vehicle = await Vehicle.create({
      brand: "Mahindra",
      model: "XUV700",
      category: "SUV",
      year: 2022,
      price: 2200000,
      fuelType: "Diesel",
      transmission: "Automatic",
      mileage: 12000,
      color: "Red",
      quantity: 2,
    });

    const res = await request(app)
      .post(`/api/vehicles/${vehicle._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(403);
  });

  it("should return only SUV vehicles when category=SUV is passed", async () => {
    await Vehicle.create([
      {
        brand: "BMW",
        model: "M5",
        category: "Sedan",
        year: 2023,
        price: 90000,
        fuelType: "Petrol",
        transmission: "Automatic",
        mileage: 500,
        color: "Black",
        quantity: 2,
      },
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2023,
        price: 45000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 1000,
        color: "White",
        quantity: 3,
      },
    ]);

    const res = await request(app).get("/api/vehicles?category=SUV");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].category).toBe("SUV");
  });

  it("should return only Automatic vehicles when transmission=Automatic is passed", async () => {
    await Vehicle.create([
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
    ]);

    const res = await request(app).get("/api/vehicles?transmission=Automatic");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].transmission).toBe("Automatic");
  });

  it("should return only matching vehicles when model is passed", async () => {
    await Vehicle.create([
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
    ]);

    const res = await request(app).get("/api/vehicles?model=City");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].model).toBe("City");
  });

  it("should filter vehicles by brand", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
    ]);

    const res = await request(app).get("/api/vehicles?brand=Toyota");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].brand).toBe("Toyota");
  });

  it("should filter vehicles by fuel type", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
    ]);

    const res = await request(app).get("/api/vehicles?fuelType=Diesel");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].fuelType).toBe("Diesel");
  });

  it("should filter vehicles by price range", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
      {
        brand: "Hyundai",
        model: "Creta",
        category: "SUV",
        year: 2020,
        price: 1800000,
        fuelType: "Petrol",
        transmission: "Automatic",
        mileage: 18000,
        color: "Blue",
        quantity: 1,
      },
    ]);

    const res = await request(app).get(
      "/api/vehicles?minPrice=1000000&maxPrice=3000000"
    );

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should sort vehicles by price in ascending order", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
    ]);

    const res = await request(app).get("/api/vehicles?sortBy=price&order=asc");

    expect(res.status).toBe(200);
    expect(res.body.data[0].price).toBe(1200000);
    expect(res.body.data[1].price).toBe(3500000);
  });

  it("should search vehicles by brand or model", async () => {
    await Vehicle.create([
      {
        brand: "Toyota",
        model: "Fortuner",
        category: "SUV",
        year: 2022,
        price: 3500000,
        fuelType: "Diesel",
        transmission: "Automatic",
        mileage: 15000,
        color: "Black",
        quantity: 3,
      },
      {
        brand: "Honda",
        model: "City",
        category: "Sedan",
        year: 2021,
        price: 1200000,
        fuelType: "Petrol",
        transmission: "Manual",
        mileage: 22000,
        color: "White",
        quantity: 2,
      },
    ]);

    const res = await request(app).get("/api/vehicles?search=toyota");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].brand).toBe("Toyota");
  });
});