import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Heart, Menu, User, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LocationPrompt, getStoredLocation } from "@/components/LocationPrompt";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  useEffect(() => {
    if (user && !getStoredLocation()) setShowLocationPrompt(true);
  }, [user]);

  const navLinks = [
    { href: "/browse", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <>
      <LocationPrompt open={showLocationPrompt} onClose={() => setShowLocationPrompt(false)} />
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-background/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
        <div className="container flex h-16 items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center">
              <img src="/images/logo.png" alt="Thryft" className="h-12 md:h-14 w-auto" />
            </motion.div>
          </Link>

          {/* Center: Nav + Search */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-3">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                    location.pathname === link.href
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-black/[0.04] dark:bg-white/[0.08] text-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for brands, styles, vibes..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-background transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <Link to="/sell">
              <Button variant="hero" size="sm" className="hidden sm:flex gap-1.5 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                Sell
              </Button>
            </Link>

            <Link to="/profile?tab=saved">
              <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            {user ? (
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signInWithGoogle()}
                className="gap-1.5 text-xs sm:text-sm hidden sm:flex rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/10 border-black/10 dark:border-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Login
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-background/80 backdrop-blur-2xl"
          >
            <div className="container py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for brands, styles, vibes..."
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Sell
                </Link>
                <Link to="/profile?tab=saved" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Saved
                </Link>
                <div className="border-t border-black/5 dark:border-white/10 my-1" />
                {user ? (
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-left">
                    Sign out
                  </button>
                ) : (
                  <button onClick={() => { signInWithGoogle(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-left">
                    Login with Google
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
