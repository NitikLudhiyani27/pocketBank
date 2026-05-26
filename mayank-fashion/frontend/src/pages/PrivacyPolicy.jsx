export default function PrivacyPolicy() {
  return (
    <div className="container-x py-12 max-w-3xl animate-fade-in">
      <h1 className="heading-display text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: January 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect information you provide when creating an account, placing an order, or subscribing to our newsletter — including
            your name, email, phone number, shipping address, and payment details. We also collect non-personal data such as device
            type, browser, and pages visited to improve our service.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill orders</li>
            <li>Send order confirmations, shipping updates, and customer support replies</li>
            <li>Personalize product recommendations</li>
            <li>Send promotional emails (only if you opt in)</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">3. Data Sharing</h2>
          <p>
            We never sell your personal data. We share information only with trusted partners who help us run our store —
            payment processors (Razorpay), shipping carriers, and email service providers — and only the minimum needed to fulfill
            your order.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">4. Cookies</h2>
          <p>
            We use cookies to keep you logged in, remember your cart, and analyze site usage. You can disable cookies in your
            browser settings, though some features may not work as expected.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">5. Your Rights</h2>
          <p>
            You can access, update, or delete your account information at any time from your Profile page. To request a full data
            export or account deletion, email us at <a className="text-brand-600" href="mailto:privacy@mayankfashion.com">privacy@mayankfashion.com</a>.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">6. Security</h2>
          <p>
            Passwords are hashed with bcrypt. Payment data is handled directly by Razorpay (PCI-DSS Level 1). We use HTTPS for all
            traffic and never store card details on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">7. Contact</h2>
          <p>
            Questions? Reach us at <a className="text-brand-600" href="mailto:privacy@mayankfashion.com">privacy@mayankfashion.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
