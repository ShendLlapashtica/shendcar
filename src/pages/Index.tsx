import { useState } from 'react';
import type { EncarCar } from '@/data/cars';
import { useEncarCars, DEFAULT_FILTERS } from '@/hooks/useEncarCars';
import type { EncarFilters } from '@/hooks/useEncarCars';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CarCard from '@/components/CarCard';
import FilterSidebar from '@/components/FilterSidebar';
import FinanceCalculator from '@/components/FinanceCalculator';
import CarDetailModal from '@/components/CarDetailModal';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LayoutGrid, List, SlidersHorizontal, Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

function CarSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

const Index = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<EncarFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [selectedCar, setSelectedCar] = useState<EncarCar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useEncarCars(filters, page);

  const cars = data?.SearchResults ?? [];
  const totalCount = data?.Count ?? 0;
  const totalPages = Math.ceil(totalCount / 20);

  const handleViewDetails = (car: EncarCar) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleSelectCar = (car: EncarCar) => {
    setSelectedCar(car);
    const el = document.querySelector('[role="dialog"]');
    if (el) el.scrollTop = 0;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleFiltersChange = (newFilters: EncarFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);
  };

  const activeFiltersCount = [
    filters.manufacturers.length > 0,
    filters.fuelTypes.length > 0,
    filters.transmissions.length > 0,
    !!filters.yearFrom,
    !!filters.yearTo,
    !!filters.mileageMax && filters.mileageMax < 300000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <CarIcon className="h-6 w-6 text-primary" />
              <h2 className="font-heading text-2xl md:text-3xl font-bold section-underline">
                Veturat në Shitje
              </h2>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {isLoading ? '…' : `${totalCount.toLocaleString()} vetura`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtrat
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
                  <div className="p-4">
                    <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} onReset={resetFilters} />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="px-3">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="px-3">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} onReset={resetFilters} />
              <div className="mt-6"><FinanceCalculator /></div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {isError ? (
                <div className="text-center py-16">
                  <p className="text-destructive font-medium mb-2">Ndodhi një gabim gjatë ngarkimit të veturave.</p>
                  <p className="text-muted-foreground text-sm mb-4">Ju lutemi provoni përsëri.</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>Rifresko</Button>
                </div>
              ) : isLoading ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => <CarSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                  </div>
                )
              ) : cars.length === 0 ? (
                <div className="text-center py-16">
                  <CarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-heading text-xl font-semibold mb-2">Nuk u gjetën vetura</h3>
                  <p className="text-muted-foreground mb-4">Provoni të ndryshoni filtrat tuaja</p>
                  <Button variant="outline" onClick={resetFilters}>Reseto Filtrat</Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {cars.map((car, index) => (
                    <div key={car.Id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CarCard car={car} viewMode="grid" onViewDetails={handleViewDetails} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cars.map((car, index) => (
                    <div key={car.Id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CarCard car={car} viewMode="list" onViewDetails={handleViewDetails} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />Prapa
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Faqja {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Tjetër<ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile finance calculator */}
      <section className="lg:hidden py-8 bg-secondary/30">
        <div className="container mx-auto px-4"><FinanceCalculator /></div>
      </section>

      <ContactSection />
      <Footer />

      <CarDetailModal
        car={selectedCar}
        allCars={cars}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSelectCar={handleSelectCar}
      />
    </div>
  );
};

export default Index;
