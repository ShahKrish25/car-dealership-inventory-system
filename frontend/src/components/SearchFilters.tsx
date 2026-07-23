import { useState } from 'react';
import type { VehicleFilters } from '../api/vehicles';

interface Props {
  onFilter: (filters: VehicleFilters) => void;
}

const omitEmptyFilters = (filters: VehicleFilters): VehicleFilters =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined)
  );

export default function SearchFilters({ onFilter }: Props) {
  const [filters, setFilters] = useState<VehicleFilters>({});

  const handleChange = (key: keyof VehicleFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(omitEmptyFilters(filters));
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  const inputClasses = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClasses = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-8">
      {/* Search Input */}
      <div className="mb-5 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search by brand or model..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className={`${inputClasses} pl-10 py-3 text-base`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label className={labelClasses}>Brand</label>
          <input
            type="text"
            placeholder="e.g. Toyota"
            value={filters.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Model</label>
          <input
            type="text"
            placeholder="e.g. Fortuner"
            value={filters.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClasses}
          >
            <option value="">All Categories</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>Fuel Type</label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className={inputClasses}
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>Transmission</label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className={inputClasses}
          >
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>Min Price (₹)</label>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Max Price (₹)</label>
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-colors"
        >
          Search & Filter
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
