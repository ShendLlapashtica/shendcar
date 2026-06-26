import { useQuery } from '@tanstack/react-query';
import type { EncarCar } from '@/data/cars';

export interface EncarFilters {
  manufacturers: string[];
  fuelTypes: string[];
  transmissions: string[];
  yearFrom?: number;
  yearTo?: number;
  mileageMax?: number;
}

export interface EncarSearchResult {
  Count: number;
  SearchResults: EncarCar[];
}

const PAGE_SIZE = 20;

async function fetchCars(filters: EncarFilters, page: number): Promise<EncarSearchResult> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('count', String(PAGE_SIZE));

  // pass all selected values as comma-separated; server builds OR query
  if (filters.manufacturers.length > 0) params.set('manufacturers', filters.manufacturers.join(','));
  if (filters.fuelTypes.length > 0)     params.set('fuels', filters.fuelTypes.join(','));
  if (filters.transmissions.length > 0) params.set('transmissions', filters.transmissions.join(','));
  if (filters.yearFrom)  params.set('yearFrom', String(filters.yearFrom));
  if (filters.yearTo)    params.set('yearTo', String(filters.yearTo));
  if (filters.mileageMax && filters.mileageMax < 300000) params.set('mileageMax', String(filters.mileageMax));

  const res = await fetch(`/api/cars?${params.toString()}`);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  // Encar sometimes wraps results differently — normalise
  if (Array.isArray(data?.SearchResults)) return data as EncarSearchResult;
  if (Array.isArray(data?.Result)) return { Count: data.TotalCount ?? data.Result.length, SearchResults: data.Result };
  return { Count: 0, SearchResults: [] };
}

export function useEncarCars(filters: EncarFilters, page: number) {
  return useQuery<EncarSearchResult, Error>({
    queryKey: ['encar-cars', filters, page],
    queryFn: () => fetchCars(filters, page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
    retry: 2,
  });
}

export const DEFAULT_FILTERS: EncarFilters = {
  manufacturers: [],
  fuelTypes: [],
  transmissions: [],
};
