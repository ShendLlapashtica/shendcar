import Header from "@/components/Header";
import { MapPin, Mail } from "lucide-react";

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">Na Kontaktoni</h1>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-lg hover:shadow-card-hover transition-shadow">
              <MapPin className="h-8 w-8 text-primary" />
              <div><p className="font-semibold text-lg">Lokacionet</p><p className="text-muted-foreground">Ferizaj, Drenas</p></div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-lg">
              <MapPin className="h-8 w-8 text-primary" />
              <div><p className="font-semibold text-lg">Lokacioni</p><p className="text-muted-foreground">Kosovë</p></div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium text-lg">
              <MapPin className="h-5 w-5" />Ferizaj, Drenas
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-black text-white/60 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} EA Auto Import. Të gjitha të drejtat e rezervuara.</p>
      </footer>
    </div>
  );
};

export default Kontakt;
