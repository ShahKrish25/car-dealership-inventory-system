import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../controllers/vehicle.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getVehicles);
router.get("/search", getVehicles); // Dedicated search route (supports ?make=&model=&category=&minPrice=&maxPrice=&search=)

// Admin-protected routes
router.post("/", authenticate, isAdmin, createVehicle);
router.put("/:id", authenticate, isAdmin, updateVehicle);
router.delete("/:id", authenticate, isAdmin, deleteVehicle);
router.post("/:id/purchase", authenticate, purchaseVehicle);
router.post("/:id/restock", authenticate, isAdmin, restockVehicle);

export default router;