import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-foreground font-medium">Last updated: February 2026</p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Thryft, you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must sign in with a valid Google account to list or purchase items.</li>
              <li>You are responsible for all activity under your account.</li>
              <li>You must provide accurate information when listing products.</li>
              <li>Users can act as both buyers and sellers on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Product Listings</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All listed items must be authentic and accurately described.</li>
              <li>Sellers must include clear photos showing the actual condition of items.</li>
              <li>Listings are subject to verification before going live.</li>
              <li>Thryft reserves the right to remove listings that violate our policies.</li>
              <li>Product categories are limited to iPhone, MacBook, and Watch.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Transactions</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Booking visits requires a refundable deposit of ₹1,000.</li>
              <li>Full payment purchases receive a ₹1,000 discount.</li>
              <li>Visit booking deposits are fully refundable if you decide not to purchase.</li>
              <li>Thryft charges a 7% platform fee on successful sales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Product Status</h2>
            <p>Products on Thryft can have three statuses:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Live</strong> — Available for purchase or visit booking</li>
              <li><strong>Hold</strong> — Currently reserved; you can sign up for notifications</li>
              <li><strong>Sold</strong> — No longer available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Prohibited Conduct</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Listing counterfeit, stolen, or prohibited items</li>
              <li>Misrepresenting the condition or authenticity of products</li>
              <li>Harassing, threatening, or abusing other users</li>
              <li>Attempting to circumvent the platform for transactions</li>
              <li>Creating multiple accounts for fraudulent purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>
              Thryft acts as a marketplace connecting buyers and sellers. We are not responsible for the
              quality, safety, or legality of items listed. Transactions are conducted at the users' own
              risk. We do our best to verify listings but cannot guarantee every item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of Thryft after changes constitutes
              acceptance of the new terms. We will notify users of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="tel:7095288950" className="text-primary hover:underline">7095288950</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
