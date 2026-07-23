import type { VehicleFilters } from '../api/vehicles';

/**
 * Replaces active filters with the submitted form values.
 * Keeps pagination limit from the previous state.
 * Intentionally does NOT merge old filter keys — clearing a dropdown
 * to "All" must remove that filter from the query.
 */
export function applyVehicleFilters(
  previous: VehicleFilters,
  next: VehicleFilters
): VehicleFilters {
  return {
    limit: previous.limit ?? 9,
    page: 1,
    ...next,
  };
}
