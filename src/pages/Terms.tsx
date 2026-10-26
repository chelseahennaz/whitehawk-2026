import { motion } from "framer-motion";

const Terms = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Legal Information
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Terms & Conditions
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
              Welcome to the official website and online store of Whitehawk Football Club. These Terms & Conditions govern your use of our website (https://whitehawkfc.com) and the purchase of any products from our online shop.
            </p>
            <p>
              By accessing or using our website, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">1. Operating Company & Contact Information</h2>
            <p>
              This website and online store are operated by <strong>WHITEHAWK FOOTBALL CLUB LIMITED</strong>, a company registered in England and Wales under Company Number 14984206.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Registered Office:</strong> Ground Floor Offices, Suite 1, The Enclosed Ground, East Brighton Park, Wilson Avenue, Brighton, East Sussex, United Kingdom, BN2 5TS</li>
              <li><strong>Operating Ground:</strong> The Enclosed Ground, East Brighton Park, Wilson Avenue, Brighton, BN2 5TS</li>
              <li><strong>Email:</strong> club@whitehawkfc.com</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">2. Use of the Website</h2>
            <p>
              You agree to use this website only for lawful purposes. You must not use our website to transmit or distribute malicious software, or attempt to gain unauthorized access to our systems, servers, or checkout portals.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">3. Product Descriptions and Pricing</h2>
            <p>
              We make every effort to display the colors, specifications, and details of our products accurately. However, we cannot guarantee that your device&apos;s display will perfectly reflect the actual products.
            </p>
            <p>
              All prices shown are in GBP (£) and are inclusive of VAT (where applicable) but exclude delivery costs, which will be clearly displayed before you finalize your order. We reserve the right to adjust pricing and product availability at any time without prior notice.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">4. Purchases & Payment Checkout</h2>
            <p>
              When you purchase items via our online store, the checkout transactions are processed securely through our payment provider, <strong>myPOS</strong>.
            </p>
            <p>
              You agree to provide current, complete, and accurate purchase and account details for all purchases. We reserve the right to refuse or cancel any order if fraudulent, unauthorized, or illegal activity is suspected.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">5. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Whitehawk Football Club Limited or its content suppliers and is protected by copyright and intellectual property laws.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Whitehawk Football Club Limited will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website, or the purchase and use of products.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">7. Governing Law</h2>
            <p>
              These Terms & Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising shall be subject to the exclusive jurisdiction of the English courts.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Terms;
