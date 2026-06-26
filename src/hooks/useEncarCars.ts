import { useQuery } from '@tanstack/react-query';
import type { EncarCar } from '@/data/cars';

export interface EncarFilters {
  manufacturers: string[];
  fuelTypes: string[];
  transmissions: string[];
  yearFrom?: number;
  yearTo?: number;
  mileageMax?: number;
  priceMin?: number;
  priceMax?: number;
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

  if (filters.manufacturers.length === 1) params.set('manufacturer', filters.manufacturers[0]);
  if (filters.fuelTypes.length === 1) params.set('fuel', filters.fuelTypes[0]);
  if (filters.transmissions.length === 1) params.set('transmission', filters.transmissions[0]);
  if (filters.yearFrom) params.set('yearFrom', String(filters.yearFrom));
  if (filters.yearTo) params.set('yearTo', String(filters.yearTo));
  if (filters.mileageMax && filters.mileageMax < 300000) params.set('mileageMax', String(filters.mileageMax));
  if (filters.priceMin) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax) params.set('priceMax', String(filters.priceMax));

  const res = await fetch(`/api/cars?${params.toString()}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function useEncarCars(filters: EncarFilters, page: number) {
  return useQuery<EncarSearchResult, Error>({
    queryKey: ['encar-cars', filters, page],
    queryFn: () => fetchCars(filters, page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export const DEFAULT_FILTERS: EncarFilters = {
  manufacturers: [],
  fuelTypes: [],
  transmissions: [],
};
