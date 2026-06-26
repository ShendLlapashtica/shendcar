import type { EncarCar } from '@/data/cars';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Gauge, Fuel, Settings2, MessageCircle, Eye, MapPin } from 'lucide-react';
import {
  carDisplayName, translateFuel, translateTrans, krwToEur, fmtEur, fmtKm, carPhotoUrl,
} from '@/lib/encar-utils';

interface CarCardProps {
  car: EncarCar;
  viewMode: 'grid' | 'list';
  onViewDetails: (car: EncarCar) => void;
}

const WA_NUMBER = '38343502651';

const CarCard = ({ car, viewMode, onViewDetails }: CarCardProps) => {
  const name = carDisplayName(car.Manufacturer, car.Model, car.Badge);
  const eurPrice = krwToEur(car.Price);
  const imgSrc = carPhotoUrl(car);
  // FormYear is the 4-digit model year; Year is YYYYMM from the API
  const displayYear = car.FormYear ? String(car.FormYear).slice(0, 4) : String(Math.floor(Number(car.Year) / 100) || car.Year);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Përshëndetje! Jam i interesuar për ${name} (${displayYear}), ${fmtKm(car.Mileage)}, çmimi ${fmtEur(eurPrice)}. A mund të më jepni më shumë informata?`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <Card
        className="car-card overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover"
        onClick={() => onViewDetails(car)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0 bg-secondary/30">
            <img
              src={imgSrc}
              alt={name}
              className="w-full h-auto object-contain"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
            />
            {car.Accident === 0 && (
              <Badge className="badge-verified absolute top-3 left-3 text-xs">✓ Pa aksident</Badge>
            )}
            {car.Certified === 'Y' && (
              <Badge className="absolute top-3 right-3 bg-blue-600 text-white text-xs">Certifikuar</Badge>
            )}
          </div>
          <CardContent className="flex-1 p-4 md:p-6">
            <div className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{carDisplayName(car.Manufacturer, '', '')}</p>
                  <h3 className="font-heading text-lg md:text-xl font-semibold">{name}</h3>
                </div>
                <span className="font-heading text-xl md:text-2xl font-bold text-primary">{fmtEur(eurPrice)}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{displayYear}</span></div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-medium">
                    <Gauge className="h-3 w-3 mr-1" />{fmtKm(car.Mileage)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm"><Settings2 className="h-4 w-4 text-muted-foreground" /><span>{translateTrans(car.Transmission)}</span></div>
                <div className="flex items-center gap-2 text-sm"><Fuel className="h-4 w-4 text-muted-foreground" /><span>{translateFuel(car.FuelType)}</span></div>
              </div>
              <div className="text-sm text-muted-foreground mb-4">{car.CylinderCapacity ? `${car.CylinderCapacity} cc` : ''}</div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
                <Button variant="outline" size="lg" className="flex-1" onClick={(e) => { e.stopPropagation(); onViewDetails(car); }}>
                  <Eye className="h-5 w-5 mr-2" />Shiko Detajet
                </Button>
                <Button size="lg" className="btn-whatsapp flex-1 text-base py-3" onClick={handleWhatsApp}>
                  <MessageCircle className="h-5 w-5 mr-2" />WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="car-card overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover group h-full"
      onClick={() => onViewDetails(car)}
    >
      <div className="relative bg-secondary/30 p-2">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
        {car.Accident === 0 && (
          <Badge className="badge-verified absolute top-4 left-4 text-xs">✓ Pa aksident</Badge>
        )}
        <div className="absolute bottom-4 right-4">
          <Badge variant="outline" className="bg-accent text-accent-foreground border-0 font-medium text-xs">
            <Gauge className="h-3 w-3 mr-1" />{fmtKm(car.Mileage)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 sm:mb-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">
            {carDisplayName(car.Manufacturer, '', '')}
          </p>
          <h3 className="font-heading text-sm sm:text-lg font-semibold leading-tight line-clamp-2">{name}</h3>
        </div>
        <p className="font-heading text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">{fmtEur(eurPrice)}</p>
        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" /><span>{displayYear}</span></div>
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground"><Settings2 className="h-3 w-3 sm:h-4 sm:w-4" /><span className="truncate">{translateTrans(car.Transmission)}</span></div>
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground"><Fuel className="h-3 w-3 sm:h-4 sm:w-4" /><span>{translateFuel(car.FuelType)}</span></div>
          <div className="text-muted-foreground text-[10px] sm:text-xs">{car.CylinderCapacity ? `${car.CylinderCapacity} cc` : ''}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full btn-whatsapp text-sm sm:text-base py-2.5 sm:py-3" onClick={handleWhatsApp}>
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="hidden sm:inline">Shkruaj në WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </Button>
          <Button variant="outline" className="w-full text-sm sm:text-base py-2.5 sm:py-3" onClick={(e) => { e.stopPropagation(); onViewDetails(car); }}>
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />Shiko Detajet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
