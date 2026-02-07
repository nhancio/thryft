import { motion } from "framer-motion";
import cardRoyal from "@/assets/card-royal.jpg";
import cardSave from "@/assets/card-save.jpg";
import cardExperiences from "@/assets/card-experiences.jpg";

const cards = [
  {
    image: cardRoyal,
    message: "Live the royal life, Now",
    rotation: -8,
    position: { x: -20, y: 20 },
  },
  {
    image: cardSave,
    message: "Thrift, Not Spend",
    rotation: 0,
    position: { x: 0, y: -10 },
  },
  {
    image: cardExperiences,
    message: "Unlock the experiences, in the reach",
    rotation: 8,
    position: { x: 20, y: 30 },
  },
];

export function HeroBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      <div className="container relative">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
          >
            Welcome to <span className="gradient-text">ThriftVerse</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Premium pre-owned products at unbeatable prices. Your gateway to luxury, sustainably.
          </motion.p>
        </div>

        {/* Floating Cards */}
        <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotate: card.rotation,
                x: card.position.x,
              }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
              className="absolute w-64 md:w-72 cursor-pointer"
              style={{
                left: `calc(50% - 144px + ${card.position.x * 3}px)`,
                top: `calc(50% - 180px + ${card.position.y}px)`,
                zIndex: index + 1,
              }}
            >
              <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <img
                    src={card.image}
                    alt={card.message}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-background text-lg md:text-xl font-semibold leading-tight">
                      {card.message}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
