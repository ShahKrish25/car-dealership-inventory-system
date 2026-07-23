import { Request, Response } from "express";
import Vehicle from "../models/vehicle.model";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const {
      brand,
      category,
      fuelType,
      minPrice,
      maxPrice,
      search,
      sortBy,
      order,
      page = "1",
      limit = "10",
    } = req.query;

    const filter: any = {};

    if (brand) {
      filter.brand = brand;
    }

    if (category) {
      filter.category = category;
    }

    if (fuelType) {
      filter.fuelType = fuelType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    let query = Vehicle.find(filter);

    if (sortBy) {
      query = query.sort({
        [sortBy as string]: order === "desc" ? -1 : 1,
      });
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Vehicle.countDocuments(filter);
    const vehicles = await query.skip(skip).limit(limitNumber);

    return res.status(200).json({
      data: vehicles,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();
    return res.status(201).json(savedVehicle);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json(updatedVehicle);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const purchaseVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({ message: "Vehicle out of stock" });
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle purchased successfully",
      vehicle,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const restockVehicle = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const restockAmount = Number(quantity) || 1;

    if (restockAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Restock quantity must be greater than 0" });
    }

    vehicle.quantity += restockAmount;
    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle restocked successfully",
      vehicle,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};