import { Request, Response } from "express";
import Vehicle from "../models/vehicle.model";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    return res.status(200).json(vehicles);
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
      { new: true }
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