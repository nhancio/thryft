import { motion } from "framer-motion";
import { Sparkles, Leaf, DollarSign, Heart } from "lucide-react";
import whatIsThriftImage from "@/assets/what-is-thrift.jpg";

const benefits = [
  { icon: DollarSign, text: "Save up to 70% on premium items" },
  { icon: Leaf, text: "Sustainable & eco-friendly shopping" },
  { icon: Sparkles, text: "Curated quality products" },
  { icon: Heart, text: "Give items a second life" },
];

export function WhatIsThrift() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              What is <span className="gradient-text">Thrifting</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Thrifting is the smart way to shop. It's about finding premium, pre-owned items 
              at a fraction of their original price. From the latest iPhones to luxury cars, 
              we bring you verified, high-quality products that have been carefully inspected 
              and authenticated.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join millions who've discovered that owning premium doesn't mean paying premium. 
              It's not just shopping—it's a lifestyle choice that's good for your wallet and 
              great for the planet.
            </p>
            
            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={whatIsThriftImage}
                alt="Happy thrifting experience"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl hidden md:block"
            >
              <div className="text-3xl font-display font-bold text-primary">70%</div>
              <div className="text-sm text-muted-foreground">Average savings</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
