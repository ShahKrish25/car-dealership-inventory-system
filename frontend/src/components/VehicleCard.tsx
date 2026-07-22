import { useState } from 'react';
import type { Vehicle } from '../api/vehicles';
import { purchaseVehicle } from '../api/vehicles';
import { useAuth } from '../context/AuthContext';

interface Props {
  vehicle: Vehicle;
  onPurchased: (updated: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onRestock?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onPurchased, onEdit, onDelete, onRestock }: Props) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isOutOfStock = vehicle.quantity === 0;

  const handlePurchase = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const result = await purchaseVehicle(vehicle._id);
      setSuccessMsg('Purchased successfully!');
      onPurchased(result.vehicle);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Purchase failed'
          : 'Purchase failed';
      setError(message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Top Banner (Category Color Hint) */}
      <div className="h-1 bg-blue-600 w-full"></div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className="text-sm text-gray-500 font-medium">{vehicle.year}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              {vehicle.category}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
              isOutOfStock ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fuel</div>
            <div className="text-sm text-gray-900 font-medium">{vehicle.fuelType}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Transmission</div>
            <div className="text-sm text-gray-900 font-medium">{vehicle.transmission}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Mileage</div>
            <div className="text-sm text-gray-900 font-medium">{vehicle.mileage.toLocaleString()} km</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Color</div>
            <div className="text-sm text-gray-900 font-medium">{vehicle.color}</div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100 mt-auto">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Price</div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{vehicle.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Status Messages */}
        {(error || successMsg) && (
          <div className={`p-2.5 rounded-md text-sm font-medium ${
            error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {error || successMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isAuthenticated && !onRestock && (
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || loading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold text-white transition-colors ${
                isOutOfStock || loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              {loading ? 'Processing...' : isOutOfStock ? 'Sold Out' : 'Purchase'}
            </button>
          )}

          {isAdmin && onRestock && (
            <>
              <button
                onClick={() => onEdit?.(vehicle)}
                className="flex-1 py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onRestock?.(vehicle)}
                className="flex-1 py-2 px-3 bg-blue-50 border border-blue-200 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Restock
              </button>
              <button
                onClick={() => onDelete?.(vehicle._id)}
                className="py-2 px-3 bg-white border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Delete vehicle"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
