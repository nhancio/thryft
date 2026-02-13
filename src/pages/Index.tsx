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
      <section className="py-8 sm:py-12 md:py-24">
        <div className="container">
          <div className="text-center py-8 sm:py-12 px-4 sm:px-6 rounded-2xl sm:rounded-3xl bg-foreground text-background">
            <Phone className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-primary" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2">
              Have questions?
            </h2>
            <p className="text-background/70 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              We're here to help. Reach out to us anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:7095288950"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" />
                70952 88950
              </a>
              <a
                href="tel:6304408747"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" />
                63044 08747
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
