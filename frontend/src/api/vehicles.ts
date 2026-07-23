import axiosInstance from './axiosInstance';

export interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  category: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  search?: string;
  brand?: string;
  model?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface VehiclesResponse {
  data: Vehicle[];
  total: number;
  page: number;
  pages: number;
}

export interface VehiclePayload {
  brand: string;
  model: string;
  category: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  color: string;
  quantity: number;
}

// GET /api/vehicles — list with filters/pagination
export const getVehicles = async (filters: VehicleFilters = {}): Promise<VehiclesResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  const response = await axiosInstance.get<VehiclesResponse>('/api/vehicles', { params });
  return response.data;
};

// GET /api/vehicles/search — dedicated search endpoint
export const searchVehicles = async (filters: VehicleFilters = {}): Promise<VehiclesResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
  );
  const response = await axiosInstance.get<VehiclesResponse>('/api/vehicles/search', { params });
  return response.data;
};

// POST /api/vehicles — create vehicle (admin)
export const createVehicle = async (payload: VehiclePayload): Promise<Vehicle> => {
  const response = await axiosInstance.post<Vehicle>('/api/vehicles', payload);
  return response.data;
};

// PUT /api/vehicles/:id — update vehicle (admin)
export const updateVehicle = async (id: string, payload: Partial<VehiclePayload>): Promise<Vehicle> => {
  const response = await axiosInstance.put<Vehicle>(`/api/vehicles/${id}`, payload);
  return response.data;
};

// DELETE /api/vehicles/:id — delete vehicle (admin)
export const deleteVehicle = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/vehicles/${id}`);
};

// POST /api/vehicles/:id/purchase — purchase vehicle
export const purchaseVehicle = async (id: string): Promise<{ message: string; vehicle: Vehicle }> => {
  const response = await axiosInstance.post(`/api/vehicles/${id}/purchase`);
  return response.data;
};

// POST /api/vehicles/:id/restock — restock vehicle (admin)
export const restockVehicle = async (id: string, quantity: number): Promise<{ message: string; vehicle: Vehicle }> => {
  const response = await axiosInstance.post(`/api/vehicles/${id}/restock`, { quantity });
  return response.data;
};
