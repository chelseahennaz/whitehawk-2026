import { motion } from "framer-motion";

const DeliveryTerms = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Legal Information
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Delivery Terms
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
              We aim to dispatch all shop orders quickly so you can represent the Hawks as soon as possible. Below are the details of our shipping methods, rates, and delivery timeframes.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">1. Delivery Destinations</h2>
            <p>
              We deliver to addresses within the United Kingdom. For international shipping enquiries, please contact us at <a href="mailto:club@whitehawkfc.com" className="text-[#8e160b] hover:underline font-semibold">club@whitehawkfc.com</a> before placing an order to get a custom shipping quote.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">2. Delivery Options & Costs</h2>
            <p>
              We offer the following shipping methods, which are calculated and displayed at checkout:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Delivery (Royal Mail 2nd Class):</strong> £3.99 (Delivered within 3–5 working days)</li>
              <li><strong>Express Delivery (Royal Mail 1st Class):</strong> £5.99 (Delivered within 1–2 working days)</li>
              <li><strong>Local Collection (Free):</strong> Collect in person from the The Enclosed Ground Club Shop during matchdays or office hours. We will email you once your order is ready for pickup.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">3. Order Processing & Dispatch</h2>
            <p>
              All orders are packed and dispatched by our volunteer team. We aim to process and ship orders within <strong>2 to 3 working days</strong> of receiving cleared payment. Orders placed over the weekend or on public holidays will be processed on the next business day.
            </p>
            <p>
              Please note that during peak times (such as pre-season kit launches or the holiday season), dispatch times may be slightly longer.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">4. Tracking and Support</h2>
            <p>
              If a trackable delivery method is selected, we will provide the tracking link in your dispatch confirmation email. If you have not received your package within 7 working days of receiving your dispatch email, please reach out to us at <a href="mailto:club@whitehawkfc.com" className="text-[#8e160b] hover:underline font-semibold">club@whitehawkfc.com</a> so we can investigate.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">5. Damaged or Lost Shipments</h2>
            <p>
              If your order arrives damaged, please retain all packaging and contact us within 48 hours of receipt. If an order is deemed lost in transit (not delivered after 10 working days), we will file a claim with the carrier and arrange a replacement or refund.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DeliveryTerms;
