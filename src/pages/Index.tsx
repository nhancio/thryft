import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { ProductsSection } from "@/components/home/ProductsSection";
import { Categories } from "@/components/home/Categories";
import { Phone } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <ProductsSection />
      <Categories />

      {/* Contact Us */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center py-12 px-6 rounded-3xl bg-foreground text-background">
            <Phone className="w-10 h-10 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Have questions?
            </h2>
            <p className="text-background/70 mb-6 max-w-md mx-auto">
              We're here to help. Reach out to us anytime.
            </p>
            <a
              href="tel:7095288950"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
