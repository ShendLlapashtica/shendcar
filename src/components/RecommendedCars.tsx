import type { EncarCar } from '@/data/cars';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Gauge, MessageCircle } from 'lucide-react';
import { carDisplayName, krwToEur, fmtEur, fmtKm, photoUrl } from '@/lib/encar-utils';

const WA_NUMBER = '38343502651';

interface RecommendedCarsProps {
  cars: EncarCar[];
  currentCarId: string;
  onSelectCar: (car: EncarCar) => void;
}

const RecommendedCars = ({ cars, currentCarId, onSelectCar }: RecommendedCarsProps) => {
  const recommended = cars.filter(c => c.Id !== currentCarId).slice(0, 6);

  const handleWhatsApp = (car: EncarCar, e: React.MouseEvent) => {
    e.stopPropagation();
    const name = carDisplayName(car.Manufacturer, car.Model, car.Badge);
    const msg = encodeURIComponent(`Përshëndetje! Jam i interesuar për ${name} (${car.Year}). A mund të më jepni më shumë informata?`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  if (recommended.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">🚗 Rekomandojmë</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommended.map((car) => {
          const name = carDisplayName(car.Manufacturer, car.Model, car.Badge);
          const imgSrc = car.Photos?.[0]?.RealName ? photoUrl(car.Photos[0].RealName) : '/placeholder.svg';
          return (
            <Card
              key={car.Id}
              className="car-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onSelectCar(car)}
            >
              <div className="relative bg-secondary/30 p-2">
                <img
                  src={imgSrc}
                  alt={name}
                  className="w-full h-auto object-contain"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                {car.Accident === 0 && (
                  <Badge className="badge-verified absolute top-3 left-3 flex items-center gap-1 text-xs">✓</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase">{carDisplayName(car.Manufacturer, '', '')}</p>
                <h4 className="font-heading text-sm font-semibold line-clamp-1 mb-1">{name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.Year}</span>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px] px-1.5 py-0">
                    <Gauge className="h-2.5 w-2.5 mr-0.5" />{fmtKm(car.Mileage)}
                  </Badge>
                </div>
                <p className="font-heading text-base font-bold text-primary mb-2">{fmtEur(krwToEur(car.Price))}</p>
                <Button size="sm" className="w-full btn-whatsapp text-xs py-2" onClick={(e) => handleWhatsApp(car, e)}>
                  <MessageCircle className="h-3 w-3 mr-1" />WhatsApp
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedCars;
