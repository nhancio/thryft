import { Link } from "react-router-dom";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold">
              <span className="text-primary">Thryft</span>
            </Link>
            <p className="text-background/70 text-sm mt-4 max-w-xs">
              The Gen Z marketplace for unique finds. Thrifting made fresh, sustainable, and social.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <Link to="/browse" className="hover:text-primary transition-colors">Browse All</Link>
              <Link to="/categories" className="hover:text-primary transition-colors">Categories</Link>
              <Link to="/browse?category=iPhone" className="hover:text-primary transition-colors">iPhone</Link>
              <Link to="/browse?category=MacBook" className="hover:text-primary transition-colors">MacBook</Link>
              <Link to="/browse?category=Watch" className="hover:text-primary transition-colors">Watch</Link>
            </nav>
          </div>

          {/* Sell */}
          <div>
            <h4 className="font-semibold mb-4">Sell</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <Link to="/sell" className="hover:text-primary transition-colors">List an Item</Link>
              <Link to="/seller-guide" className="hover:text-primary transition-colors">Seller Guide</Link>
              <Link to="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link>
              <Link to="/fees" className="hover:text-primary transition-colors">Fees & Pricing</Link>
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <nav className="flex flex-col gap-2 text-sm text-background/70">
              <Link to="/help" className="hover:text-primary transition-colors">FAQ</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link>
              <Link to="/policies" className="hover:text-primary transition-colors">Policies</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © 2024 Thryft. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link to="/privacy" className="hover:text-background transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-background transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
