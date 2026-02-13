import { motion } from "framer-motion";
import {
  Shield,
  Leaf,
  Wallet,
  Sparkles,
  TrendingUp,
  Heart,
  DollarSign,
  Phone,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import whatIsThriftImage from "@/assets/what-is-thrift.jpg";

const benefits = [
  { icon: DollarSign, text: "Save up to 70% on premium items" },
  { icon: Leaf, text: "Sustainable & eco-friendly shopping" },
  { icon: Sparkles, text: "Curated quality products" },
  { icon: Heart, text: "Give items a second life" },
];

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

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-10 max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            About <span className="gradient-text">Thryft</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The Gen Z marketplace for unique finds. Thrifting made fresh, sustainable, and social.
          </p>
        </motion.div>

        {/* The Thryft Story */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              So… <span className="gradient-text">You Still Pay Full Price?</span>
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
                    couldn't be us —{" "}
                    <span className="font-semibold text-primary">respectfully</span>.
                  </p>
                </div>
              </div>
            </div>

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
        </section>

        {/* Why Thrift Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
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
        </section>

        {/* Contact */}
        <section className="text-center py-12 rounded-3xl bg-muted/30 border border-border/50">
          <Phone className="w-10 h-10 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-display font-bold mb-2">Get in touch</h2>
          <p className="text-muted-foreground mb-4">Have questions? We'd love to hear from you.</p>
          <a
            href="tel:7095288950"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" />
            Call us: 7095288950
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
