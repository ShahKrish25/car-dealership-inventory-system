import { useState, useEffect, useCallback } from 'react';
import { getVehicles, searchVehicles } from '../api/vehicles';
import type { Vehicle, VehicleFilters } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import SearchFilters from '../components/SearchFilters';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { isAdmin, user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState<VehicleFilters>({ page: 1, limit: 9 });

  const fetchVehicles = useCallback(async (filters: VehicleFilters) => {
    setLoading(true);
    setError('');
    try {
      const fetcher = filters.search ? searchVehicles : getVehicles;
      const data = await fetcher({ ...filters, limit: 9 });
      setVehicles(data.data);
      setTotal(data.total);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch {
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(activeFilters);
  }, [activeFilters, fetchVehicles]);

  const handleFilter = (filters: VehicleFilters) => {
    const newFilters = { ...activeFilters, ...filters, page: 1 };
    setActiveFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...activeFilters, page: newPage };
    setActiveFilters(newFilters);
  };

  const handlePurchased = (updatedVehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v._id === updatedVehicle._id ? updatedVehicle : v))
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Vehicle Inventory
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome back, <span className="font-semibold text-blue-600">{user?.id ? 'User' : 'Guest'}</span>
              {isAdmin && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Admin Mode
                </span>
              )}
            </p>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700">
            {loading ? '...' : total} vehicles found
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilters onFilter={handleFilter} />

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm font-medium">Loading vehicles...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center shadow-sm">
            <span className="text-lg mr-2">⚠️</span>
            {error}
            <button
              onClick={() => fetchVehicles(activeFilters)}
              className="ml-4 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onPurchased={handlePurchased}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap pb-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-md text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 border hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
