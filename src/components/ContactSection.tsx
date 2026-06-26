import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react";

const WA_NUMBER = "38343502651";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = encodeURIComponent(`Përshëndetje! Unë quhem ${name}.\n\n${message}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${fullMessage}`, "_blank");
  };

  const handleDirectWhatsApp = () => {
    const defaultMessage = encodeURIComponent("Përshëndetje! Jam i interesuar për veturat tuaja. A mund të më ndihmoni?");
    window.open(`https://wa.me/${WA_NUMBER}?text=${defaultMessage}`, "_blank");
  };

  return (
    <section id="contact" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 section-underline inline-block">Na Kontaktoni</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">Jemi këtu për t'ju ndihmuar të gjeni veturën e ëndrrave tuaja</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            <Card className="border-2 border-foreground/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><MapPin className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Lokacioni</h3>
                    <p className="text-muted-foreground">Ferizaj, Drenas</p>
                    <p className="text-sm text-muted-foreground mt-1">EA Auto Import</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-foreground/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><MapPin className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Lokacionet</h3>
                    <p className="text-primary font-medium">Ferizaj, Drenas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-foreground/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><Clock className="h-6 w-6 text-primary" /></div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">Orari</h3>
                    <p className="text-muted-foreground">E Hënë - E Shtunë</p>
                    <p className="text-sm text-muted-foreground">09:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button className="w-full btn-whatsapp py-6 text-lg" onClick={handleDirectWhatsApp}>
              <MessageCircle className="h-6 w-6 mr-3" />Shkruaj Direkt në WhatsApp
            </Button>
          </div>
          <Card className="border-2 border-foreground/10">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-semibold mb-6">Dërgo Mesazh via WhatsApp</h3>
              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Emri juaj</Label>
                  <Input id="name" placeholder="Shkruani emrin tuaj" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Mesazhi</Label>
                  <Textarea id="message" placeholder="Shkruani mesazhin tuaj këtu..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} className="mt-1" />
                </div>
                <Button type="submit" className="w-full" size="lg"><Send className="h-4 w-4 mr-2" />Dërgo Mesazhin</Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">* Mesazhi do të hapet në aplikacionin WhatsApp</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
