import type { VehicleFilters } from '../api/vehicles';

/** Replace filters with form values; keep limit. Do not merge stale keys. */
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
