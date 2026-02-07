import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload Photo",
    description: "Snap a photo of your item",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "AI Does the Magic",
    description: "We auto-generate title, description & price",
  },
  {
    icon: Zap,
    step: "3",
    title: "Go Live",
    description: "Review and publish in seconds",
  },
];

export function SellNow() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-foreground text-background p-8 md:p-16"
        >
          {/* Background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary))_0%,transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,hsl(var(--accent))_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
                Ready to Sell?
              </h2>
              <p className="text-lg text-background/70 max-w-2xl mx-auto">
                Upload a photo and let our AI do the magic. List your item in under 2 minutes.
              </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-background/10 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-background/60">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/sell">
                <Button variant="hero" size="xl">
                  Start Selling Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
