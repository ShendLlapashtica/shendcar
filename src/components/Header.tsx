import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Phone, MapPin, Menu, X, Shield, Car, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Ballina", icon: Car },
    { href: "/dogane", label: "Dogane", icon: FileText },
    { href: "/kontakt", label: "Kontakt", icon: Mail },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="EA Auto Import" className="h-12 w-12 rounded-full object-cover" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div 
              className="flex items-center gap-2 text-white transition-colors"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Ferizaj, Drenas</span>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <div 
              className="flex items-center gap-2 text-white p-2"
            >
              <MapPin className="h-5 w-5" />
            </div>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-black border-white/10">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="p-6 border-b border-white/10">
                    <img src={logo} alt="EA Auto Import" className="h-10 w-10 rounded-full object-cover" />
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                          isActive(link.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Contact */}
                  <div className="p-6 border-t border-white/10 space-y-4">
                    <div 
                      className="flex items-center gap-3 text-white font-medium"
                    >
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Ferizaj, Drenas</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
