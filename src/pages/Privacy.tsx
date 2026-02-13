import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-foreground font-medium">Last updated: February 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>When you use Thryft, we collect information you provide directly, including:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Name, email address, and profile photo (via Google Sign-In)</li>
              <li>Location data (when you grant permission or enter manually)</li>
              <li>Product listing details including photos, descriptions, and pricing</li>
              <li>Phone number (if you opt-in for notifications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Provide, maintain, and improve Thryft's services</li>
              <li>Display your product listings to potential buyers</li>
              <li>Send notifications about your listings and transactions</li>
              <li>Ensure safety and prevent fraud</li>
              <li>Personalize your experience based on location and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
            <p>
              Your data is stored securely using Supabase infrastructure with row-level security policies.
              Product images are stored in secure cloud storage. We implement industry-standard security
              measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Google OAuth</strong> — for authentication</li>
              <li><strong>Supabase</strong> — for data storage and backend services</li>
              <li><strong>OpenStreetMap Nominatim</strong> — for reverse geocoding location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of notifications</li>
              <li>Update or correct your information via your profile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies & Local Storage</h2>
            <p>
              We use browser local storage to remember your location preference and authentication session.
              We do not use third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="tel:7095288950" className="text-primary hover:underline">7095288950</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
