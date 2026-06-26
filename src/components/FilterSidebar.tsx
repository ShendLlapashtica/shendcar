import { POPULAR_BRANDS, FUEL_OPTIONS } from '@/lib/encar-utils';
import type { EncarFilters } from '@/hooks/useEncarCars';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RotateCcw } from 'lucide-react';

// Re-export so Index.tsx can import the type from here
export type { EncarFilters as Filters };

interface FilterSidebarProps {
  filters: EncarFilters;
  onFiltersChange: (filters: EncarFilters) => void;
  onReset: () => void;
}

const TRANSMISSION_OPTIONS = [
  { label: 'Automatik', value: 'A' },
  { label: 'Manual', value: 'M' },
];

const FilterSidebar = ({ filters, onFiltersChange, onReset }: FilterSidebarProps) => {
  const toggleItem = <T,>(arr: T[], item: T, checked: boolean): T[] =>
    checked ? [...arr, item] : arr.filter(v => v !== item);

  const handleBrand = (value: string, checked: boolean) =>
    onFiltersChange({ ...filters, manufacturers: toggleItem(filters.manufacturers, value, checked) });

  const handleFuel = (value: string, checked: boolean) =>
    onFiltersChange({ ...filters, fuelTypes: toggleItem(filters.fuelTypes, value, checked) });

  const handleTrans = (value: string, checked: boolean) =>
    onFiltersChange({ ...filters, transmissions: toggleItem(filters.transmissions, value, checked) });

  const handleYearFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    onFiltersChange({ ...filters, yearFrom: isNaN(v) ? undefined : v });
  };

  const handleYearTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    onFiltersChange({ ...filters, yearTo: isNaN(v) ? undefined : v });
  };

  const handleMileage = (value: number[]) =>
    onFiltersChange({ ...filters, mileageMax: value[0] });

  const currentYear = new Date().getFullYear();
  const mileageMax = filters.mileageMax ?? 300000;

  return (
    <div className="bg-card rounded-lg border border-border p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading text-lg font-semibold section-underline inline-block">Filtrat</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4 mr-1" />Reseto
        </Button>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Marka</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {POPULAR_BRANDS.map(b => (
            <div key={b.encarValue} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${b.encarValue}`}
                checked={filters.manufacturers.includes(b.encarValue)}
                onCheckedChange={(checked) => handleBrand(b.encarValue, checked as boolean)}
              />
              <label htmlFor={`brand-${b.encarValue}`} className="text-sm cursor-pointer">{b.label}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Year range */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Viti</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Nga"
            min={2000}
            max={currentYear}
            value={filters.yearFrom ?? ''}
            onChange={handleYearFrom}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Deri"
            min={2000}
            max={currentYear}
            value={filters.yearTo ?? ''}
            onChange={handleYearTo}
            className="text-sm"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Mileage */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">
          Kilometrazha max: {mileageMax >= 300000 ? 'Pa limit' : `${(mileageMax / 1000).toFixed(0)}k km`}
        </Label>
        <div className="px-2">
          <Slider
            min={0}
            max={300000}
            step={10000}
            value={[mileageMax]}
            onValueChange={handleMileage}
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Fuel */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-3 block">Karburanti</Label>
        <div className="space-y-2">
          {FUEL_OPTIONS.map(f => (
            <div key={f.value} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${f.value}`}
                checked={filters.fuelTypes.includes(f.value)}
                onCheckedChange={(checked) => handleFuel(f.value, checked as boolean)}
              />
              <label htmlFor={`fuel-${f.value}`} className="text-sm cursor-pointer">{f.label}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Transmission */}
      <div className="mb-4">
        <Label className="text-sm font-medium mb-3 block">Transmisioni</Label>
        <div className="space-y-2">
          {TRANSMISSION_OPTIONS.map(t => (
            <div key={t.value} className="flex items-center space-x-2">
              <Checkbox
                id={`trans-${t.value}`}
                checked={filters.transmissions.includes(t.value)}
                onCheckedChange={(checked) => handleTrans(t.value, checked as boolean)}
              />
              <label htmlFor={`trans-${t.value}`} className="text-sm cursor-pointer">{t.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
