import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Legal Information
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Privacy Policy
          </h1>
          <p className="mt-4 font-body text-sm text-muted-foreground">
            Last Updated: July 2026
          </p>
          <div className="h-1.5 w-20 bg-club-gold mt-6" />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl font-body text-base text-muted-foreground leading-relaxed space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p>
              Whitehawk Football Club ("we", "us", or "our") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you visit our website (https://whitehawkfc.com) and purchase items from our online shop.
            </p>
            <p>
              For the purpose of applicable data protection laws (including the UK GDPR and Data Protection Act 2018), the data controller is <strong>Whitehawk Football Club Limited</strong>.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">1. Information We Collect</h2>
            <p>
              We may collect and process the following information about you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information:</strong> Your name, billing address, shipping address, email address, and phone number when you place an order or contact us.</li>
              <li><strong>Payment Details:</strong> Transaction details processed securely via our payment provider (myPOS). We do not store your credit/debit card numbers directly on our servers.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type, time zone setting, and operating system when you browse the site.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">2. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and deliver your shop orders.</li>
              <li>Process payments and prevent fraudulent transactions.</li>
              <li>Provide customer support and respond to your enquiries.</li>
              <li>Comply with legal and regulatory obligations.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">3. Sharing Your Data</h2>
            <p>
              We do not sell, rent, or trade your personal data. We only share data with trusted third parties who assist us in operating our website and fulfilling your orders:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Payment Processor:</strong> myPOS, to safely process your transactions.</li>
              <li><strong>Delivery Services:</strong> Postal services and couriers to ship your products.</li>
              <li><strong>Web Hosting:</strong> Our website hosting and database providers.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to secure your personal data. All online transactions are processed through secure checkout sessions using SSL encryption. However, please be aware that no transmission of data over the internet can be guaranteed to be 100% secure.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">5. Your Rights</h2>
            <p>
              Under UK and EU data protection laws, you have the right to access, correct, delete, or restrict the processing of your personal data. To exercise any of these rights, please email us at <a href="mailto:club@whitehawkfc.com" className="text-[#8e160b] hover:underline font-semibold">club@whitehawkfc.com</a>.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
