import { Request, Response } from "express";
import Vehicle from "../models/vehicle.model";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const {
      brand,
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
      { returnDocument: "after" }
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