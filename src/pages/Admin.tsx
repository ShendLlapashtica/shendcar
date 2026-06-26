import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Car as CarIcon } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 text-center">
        <CarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="font-heading text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Inventari i veturave tani vjen drejtpërdrejt nga Encar.com — platformë me mbi 200,000 vetura.
          Administrimi manual nuk është i nevojshëm.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
