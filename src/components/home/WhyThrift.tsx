import { motion } from "framer-motion";
import { Shield, Leaf, Wallet, Sparkles, TrendingUp, Heart } from "lucide-react";

const reasons = [
  {
    icon: Wallet,
    title: "Massive Savings",
    description: "Get premium products at 50-70% off original retail prices.",
  },
  {
    icon: Shield,
    title: "Verified Quality",
    description: "Every item is inspected and authenticated by our experts.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Reduce waste and your carbon footprint with every purchase.",
  },
  {
    icon: Sparkles,
    title: "Premium Selection",
    description: "Access to luxury brands and latest tech at accessible prices.",
  },
  {
    icon: TrendingUp,
    title: "Smart Investment",
    description: "Some pre-owned items appreciate in value over time.",
  },
  {
    icon: Heart,
    title: "Feel Good Shopping",
    description: "Know that your purchase contributes to a circular economy.",
  },
];

export function WhyThrift() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            Why <span className="gradient-text">Thrift</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join the smart shopping revolution. Here's why millions choose thrifting.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
