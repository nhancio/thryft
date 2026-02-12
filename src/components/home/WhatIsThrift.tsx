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
              So… <span className="gradient-text">You Still Pay Full Price?</span>?
            </h2>
            <div className="space-y-6 mb-8">
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-amber-50 via-background to-primary/10 p-6 md:p-8 shadow-lg">
                <div className="absolute -top-6 -right-4 text-7xl font-black text-primary/10 select-none">
                  ✶
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
                  The Thryft Story
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Someone <span className="font-semibold text-foreground">bought it</span>, wore it once, forgot about it.
                  <br />
                  You find it. You style it. You own it.
                </p>
                <p className="mt-4 text-base md:text-lg leading-relaxed">
                  Why pay{" "}
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1 text-sm md:text-base font-semibold">
                    ₹2999
                  </span>{" "}
                  when you can pay{" "}
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground px-3 py-1 text-sm md:text-base font-semibold">
                    ₹699
                  </span>{" "}
                  and still look better?
                  <span className="ml-1 font-semibold text-primary">Exactly.</span>
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-border bg-background/80 p-6 md:p-8 backdrop-blur">
                <div className="absolute inset-y-4 left-0 w-1 rounded-full bg-primary/60" />
                <div className="pl-4 md:pl-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Why Thrift?
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Paying extra for the same thing is a{" "}
                    <span className="font-semibold text-foreground">bold choice</span>.
                    Thrift is getting the same brands for{" "}
                    <span className="font-semibold text-primary">half the price</span>.
                  </p>
                  <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                    No magic, just{" "}
                    <span className="font-semibold text-foreground">common sense</span>.
                    couldn’t be us —{" "}
                    <span className="font-semibold text-primary">respectfully</span>.
                  </p>
                </div>
              </div>
            </div>

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
