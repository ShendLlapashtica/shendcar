import heroBg from "@/assets/hero-bg.png";
import { MapPin, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-start max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            EA Auto<span className="text-primary"> Import</span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-3 animate-fade-in font-heading" style={{ animationDelay: "0.1s" }}>
            Importues i veturave nga Koreja e Jugut.
          </p>
          <p className="text-lg md:text-xl text-white/70 mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            Proces transparent nga inspektimi deri në regjistrim.
          </p>

          {/* Contact & Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div 
              className="flex items-center gap-2 text-white font-medium text-lg"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <span>Ferizaj, Drenas</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full shadow-lg">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Me doganë dhe homologim</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
