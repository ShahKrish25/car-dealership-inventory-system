import mongoose, { Schema } from "mongoose";

export interface IVehicle {
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    mileage: { type: Number, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", vehicleSchema);