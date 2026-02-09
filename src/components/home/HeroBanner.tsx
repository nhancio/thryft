import { motion } from "framer-motion";
import cardRoyal from "@/assets/card-royal.jpg";
import cardSave from "@/assets/card-save.jpg";
import cardExperiences from "@/assets/card-experiences.jpg";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const cards = [
  {
    image: cardRoyal,
    message: "Live the royal life, Now",
  },
  {
    image: cardSave,
    message: "Thrift, Not Spend",
  },
  {
    image: cardExperiences,
    message: "Unlock the experiences, in the reach",
  },
];

const MarqueeText = ({ text, direction = "left" }: { text: string; direction?: "left" | "right" }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap opacity-[0.08] select-none pointer-events-none">
      <motion.div
        animate={{ x: direction === "left" ? "-50%" : "0%" }}
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        className="flex gap-8 min-w-full"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="text-[10rem] md:text-[14rem] font-black uppercase leading-none font-display text-gray-400">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export function HeroBanner() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />

      {/* Flowing Text Background */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gap-0">
        <MarqueeText text="THRYFT" direction="left" />
        <MarqueeText text="FLEX" direction="right" />
        <MarqueeText text="VIBE" direction="left" />
      </div>

      <div className="container relative z-20">
        <div className="text-center mb-4 md:mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tight"
          >
            Welcome to <span className="gradient-text">Thryft</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light"
          >
            Premium pre-owned products at unbeatable prices. Your gateway to luxury, sustainably.
          </motion.p>
        </div>

        {/* Hero Carousel */}
        <div className="mt-10 md:mt-14 flex justify-center">
          <Carousel className="w-full max-w-6xl">
            <CarouselContent>
              {cards.map((card, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 70,
                      damping: 18,
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    className="w-full cursor-pointer"
                  >
                    <div className="glass-card rounded-[2.25rem] overflow-hidden shadow-2xl transition-shadow duration-500 hover:shadow-glow">
                      <div className="aspect-[3/4] relative bg-black/5">
                        <img
                          src={card.image}
                          alt={card.message}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center">
                          <p className="text-white text-xl md:text-2xl font-bold leading-tight font-display tracking-wide antialiased">
                            {card.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
