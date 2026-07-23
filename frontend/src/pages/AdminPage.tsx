import { useState, useEffect, useCallback } from 'react';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle,
} from '../api/vehicles';
import type { Vehicle, VehiclePayload } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import AdminVehicleForm from '../components/AdminVehicleForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type ModalMode = 'create' | 'edit' | 'restock' | null;

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [restockQty, setRestockQty] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Guard: redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const fetchAll = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const data = await getVehicles({ page: p, limit: 9 });
      setVehicles(data.data);
      setTotal(data.total);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin, fetchAll]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Create ---
  const handleCreate = async (payload: VehiclePayload) => {
    setFormLoading(true);
    try {
      await createVehicle(payload);
      setModalMode(null);
      showSuccess('Vehicle added successfully!');
      fetchAll(page);
    } finally {
      setFormLoading(false);
    }
  };

  // --- Edit ---
  const handleEdit = async (payload: VehiclePayload) => {
    if (!selectedVehicle) return;
    setFormLoading(true);
    try {
      await updateVehicle(selectedVehicle._id, payload);
      setModalMode(null);
      setSelectedVehicle(null);
      showSuccess('Vehicle updated successfully!');
      fetchAll(page);
    } finally {
      setFormLoading(false);
    }
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle? This cannot be undone.')) return;
    try {
      await deleteVehicle(id);
      showSuccess('Vehicle deleted successfully!');
      fetchAll(page);
    } catch {
      setError('Delete failed');
    }
  };

  // --- Restock ---
  const handleRestockSubmit = async () => {
    if (!selectedVehicle || restockQty <= 0) return;
    setFormLoading(true);
    try {
      const result = await restockVehicle(selectedVehicle._id, restockQty);
      setVehicles((prev) =>
        prev.map((v) => (v._id === selectedVehicle._id ? result.vehicle : v))
      );
      setModalMode(null);
      setSelectedVehicle(null);
      setRestockQty(1);
      showSuccess(`Restocked +${restockQty} units successfully!`);
    } catch {
      setError('Restock failed');
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-5 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Admin Panel
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your entire vehicle inventory
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="inline-flex justify-center items-center px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700">
              {total} Total Vehicles
            </span>
            <button
              onClick={() => { setSelectedVehicle(null); setModalMode('create'); }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* Success / Error banners */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-sm font-medium text-green-800 flex items-center">
            ✅ {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm font-medium text-red-800 flex items-center">
            ⚠️ {error}
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total Vehicles', value: total, icon: '🚗', colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
            { label: 'In Stock', value: vehicles.filter((v) => v.quantity > 0).length, icon: '✅', colorClass: 'text-green-600', bgClass: 'bg-green-50' },
            { label: 'Out of Stock', value: vehicles.filter((v) => v.quantity === 0).length, icon: '❌', colorClass: 'text-red-600', bgClass: 'bg-red-50' },
            { label: 'Categories', value: [...new Set(vehicles.map((v) => v.category))].length, icon: '📂', colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
          ].map(({ label, value, icon, colorClass, bgClass }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${bgClass}`}>
                {icon}
              </div>
              <div>
                <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles yet</h3>
            <p className="text-gray-500 mb-6">Add your first vehicle to get started</p>
            <button
              onClick={() => { setSelectedVehicle(null); setModalMode('create'); }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              + Add Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchased={() => {}}
                onEdit={(v) => { setSelectedVehicle(v); setModalMode('edit'); }}
                onDelete={handleDelete}
                onRestock={(v) => { setSelectedVehicle(v); setRestockQty(1); setModalMode('restock'); }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap pb-8">
            <button
              onClick={() => fetchAll(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchAll(p)}
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
              onClick={() => fetchAll(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <AdminVehicleForm
          vehicle={modalMode === 'edit' ? selectedVehicle : null}
          onClose={() => { setModalMode(null); setSelectedVehicle(null); }}
          onSubmit={modalMode === 'create' ? handleCreate : handleEdit}
          loading={formLoading}
        />
      )}

      {/* Restock Modal */}
      {modalMode === 'restock' && selectedVehicle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setModalMode(null)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">📦 Restock Vehicle</h2>
              <button onClick={() => setModalMode(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <p className="text-sm text-gray-600 mb-5">
              {selectedVehicle.brand} {selectedVehicle.model} — Current stock:{' '}
              <strong className="text-blue-600">{selectedVehicle.quantity}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Units to Add
              </label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestockSubmit}
                disabled={formLoading || restockQty <= 0}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm"
              >
                {formLoading ? 'Restocking...' : `Add ${restockQty} Units`}
              </button>
              <button
                onClick={() => setModalMode(null)}
                className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
