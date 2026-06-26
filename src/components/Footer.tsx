import logo from "@/assets/logo.png";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white/70 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src={logo} alt="EA Auto Import" className="h-16 w-16 rounded-full object-cover" />
            <p className="text-white/50 text-sm">Importues i veturave nga Koreja e Jugut</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm">
            <div className="flex items-center gap-2 text-white transition-colors font-medium">
              <MapPin className="h-4 w-4" /><span>Ferizaj, Drenas</span>
            </div>
            <p className="text-white/40 text-xs mt-2">© {new Date().getFullYear()} EA Auto Import. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
