import { useState } from 'react';
import type { Vehicle, VehiclePayload } from '../api/vehicles';

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSubmit: (payload: VehiclePayload) => Promise<void>;
  loading: boolean;
}
// sample commit
export default function AdminVehicleForm({ vehicle, onClose, onSubmit, loading }: Props) {
  const [formData, setFormData] = useState<VehiclePayload>({
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    category: vehicle?.category || 'SUV',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    fuelType: vehicle?.fuelType || 'Petrol',
    transmission: vehicle?.transmission || 'Manual',
    mileage: vehicle?.mileage || 0,
    color: vehicle?.color || '',
    quantity: vehicle?.quantity ?? 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClasses = "block text-xs font-semibold text-gray-700 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {vehicle ? '✏️ Edit Vehicle' : '➕ Add New Vehicle'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <form id="admin-vehicle-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Brand</label>
                <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Model</label>
                <input required type="text" name="model" value={formData.model} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClasses}>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Truck">Truck</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Year</label>
                <input required type="number" name="year" value={formData.year} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Price (₹)</label>
                <input required type="number" name="price" min="0" value={formData.price} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClasses}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className={inputClasses}>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Mileage (km)</label>
                <input required type="number" name="mileage" min="0" value={formData.mileage} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Color</label>
                <input required type="text" name="color" value={formData.color} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Quantity in Stock</label>
                <input required type="number" name="quantity" min="0" value={formData.quantity} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </form>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="admin-vehicle-form"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm"
          >
            {loading ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
