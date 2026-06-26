import Header from "@/components/Header";
import { FileCheck, ClipboardList, Truck, CheckCircle } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Zgjedhja e Veturës", desc: "Zgjidhni veturën nga oferta jonë ose porositni sipas dëshirës." },
  { icon: FileCheck, title: "Inspektimi & Dokumentacioni", desc: "Vetura inspektohet profesionalisht dhe përgatiten të gjitha dokumentet." },
  { icon: Truck, title: "Transporti", desc: "Vetura transportohet me siguri nga Koreja deri në Kosovë." },
  { icon: CheckCircle, title: "Doganimi & Regjistrimi", desc: "Ne kujdesemi për çdo hap – nga dogana deri te regjistrimi përfundimtar." },
];

const Dogane = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">Procesi i Doganimit</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Proces transparent nga inspektimi deri në regjistrim. Ne kujdesemi për çdo detaj.</p>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-5 p-6 bg-card border border-border rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-1">{i + 1}. {step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-black text-white/60 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} EA Auto Import. Të gjitha të drejtat e rezervuara.</p>
      </footer>
    </div>
  );
};

export default Dogane;
