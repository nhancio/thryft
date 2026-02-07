import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import catIphone from "@/assets/cat-iphone.jpg";
import catMacbook from "@/assets/cat-macbook.jpg";
import catIpad from "@/assets/cat-ipad.jpg";
import catCars from "@/assets/cat-cars.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";

const categories = [
  {
    name: "iPhone",
    slug: "iphone",
    image: catIphone,
    itemCount: "500+",
  },
  {
    name: "MacBook",
    slug: "macbook",
    image: catMacbook,
    itemCount: "250+",
  },
  {
    name: "iPad",
    slug: "ipad",
    image: catIpad,
    itemCount: "180+",
  },
  {
    name: "Cars",
    slug: "cars",
    image: catCars,
    itemCount: "120+",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: catAccessories,
    itemCount: "800+",
  },
];

export function Categories() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find exactly what you're looking for
            </p>
          </div>
          <Link
            to="/browse"
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/browse?category=${category.slug}`}
                className="group block"
              >
                <div className="relative rounded-2xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-background font-semibold text-lg">
                      {category.name}
                    </h3>
                    <p className="text-background/70 text-sm">
                      {category.itemCount} items
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/browse"
          className="mt-6 flex md:hidden items-center justify-center gap-2 text-primary font-medium"
        >
          View all categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
