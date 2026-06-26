import car1 from "@/assets/car1.jpg";
import car2 from "@/assets/car2.jpg";
import car3 from "@/assets/car3.jpg";
import car4 from "@/assets/car4.jpg";
import car5 from "@/assets/car5.jpg";
import car6 from "@/assets/car6.jpg";
import car7 from "@/assets/car7.jpg";
import car8 from "@/assets/car8.jpg";

const cars = [
  {
    image: car1,
    brand: "BMW",
    price: "€22,500",
    description: "Seria 3 (G20), kambio automatike, look sportiv dhe konsum shumë i ulët.",
  },
  {
    image: car2,
    brand: "BMW",
    price: "€25,800",
    description: "Seria 5, sallon lëkure, sensorë parkingu 360°, gjendje perfekte.",
  },
  {
    image: car3,
    brand: "BMW",
    price: "€29,500",
    description: "Modeli X5, xDrive (4x4), tavan panoramik, drita LED full option.",
  },
  {
    image: car4,
    brand: "BMW",
    price: "€15,200",
    description: "Seria 1, hatchback, shumë e shkathët për qytet dhe ekonomike.",
  },
  {
    image: car5,
    brand: "Hyundai",
    price: "€27,000",
    description: "Tucson (2021) Hybrid, modeli i ri, teknologji moderne dhe shumë komode.",
  },
  {
    image: car6,
    brand: "Hyundai",
    price: "€17,500",
    description: "Kona, SUV kompakt, 1.6 Hybrid, ideale për konsum minimal.",
  },
  {
    image: car7,
    brand: "Hyundai",
    price: "€19,800",
    description: "Santa Fe, 7 vende, makinë e fuqishme 4x4, e sigurt për familje.",
  },
  {
    image: car8,
    brand: "Hyundai",
    price: "€13,200",
    description: "i30, kambio automatike, servise të sapobëra, makinë shumë e besueshme.",
  },
];

const CarGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
          Veturat në Dispozicion
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car, i) => (
            <div
              key={i}
              className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.brand} - ${car.price}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-sm font-semibold text-muted-foreground">
                    {car.brand}
                  </span>
                  <span className="font-heading text-lg font-bold text-primary">
                    {car.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
                <div className="mt-3 w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                  Ferizaj, Drenas
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarGrid;
