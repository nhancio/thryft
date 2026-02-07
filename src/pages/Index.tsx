import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { WhatIsThrift } from "@/components/home/WhatIsThrift";
import { ProductsSection } from "@/components/home/ProductsSection";
import { Categories } from "@/components/home/Categories";
import { WhyThrift } from "@/components/home/WhyThrift";
import { SellNow } from "@/components/home/SellNow";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <WhatIsThrift />
      <ProductsSection />
      <Categories />
      <WhyThrift />
      <SellNow />
      <Footer />
    </div>
  );
};

export default Index;
