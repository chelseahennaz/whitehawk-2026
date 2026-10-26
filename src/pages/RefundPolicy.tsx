import { motion } from "framer-motion";

const RefundPolicy = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Legal Information
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Refund & Return Policy
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
              At Whitehawk Football Club, we want you to be fully satisfied with your purchase. If you are not completely happy with your online order, we are here to help with our refund, return, and cancellation options.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">1. Returns Window</h2>
            <p>
              Under the UK Consumer Contracts Regulations, you have the right to cancel your order and return goods within <strong>14 days</strong> of receiving them. The item must be returned to us within 14 days of notifying us of your intent to return it.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">2. Condition of Returned Items</h2>
            <p>
              To be eligible for a full refund or exchange:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Items must be unused, unwashed, and in the same condition that you received them.</li>
              <li>Items must be in their original packaging with all tags still attached.</li>
              <li>Customized items (e.g. replica shirts printed with custom names or numbers) cannot be returned or refunded unless there is a manufacturing defect.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">3. How to Start a Return</h2>
            <p>
              To initiate a return, please email us at <a href="mailto:club@whitehawkfc.com" className="text-[#8e160b] hover:underline font-semibold">club@whitehawkfc.com</a> with your Order ID (e.g., WHF-XXXXXXXX) and details of the item(s) you wish to return.
            </p>
            <p>
              You can return items by post or in person at the club shop on matchdays. Unless the item is faulty or incorrect, you will be responsible for paying the shipping costs for returning your item. We recommend using a trackable shipping service.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">4. Refunds Process</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item and whether your refund is approved.
            </p>
            <p>
              If approved, your refund will be processed and automatically applied to your original method of payment (via myPOS) within <strong>5 to 10 business days</strong>, depending on your card issuer.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">5. Order Cancellations</h2>
            <p>
              If you wish to cancel an order you have just placed, please contact us immediately at <a href="mailto:club@whitehawkfc.com" className="text-[#8e160b] hover:underline font-semibold">club@whitehawkfc.com</a>. If the order has not yet been dispatched, we will cancel the order and process a full refund. If the order has already been dispatched, you will need to follow the standard return process after receipt.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">6. Damaged or Faulty Items</h2>
            <p>
              In the unlikely event that you receive a damaged or faulty product, please contact us within 14 days of receipt with photos of the issue. We will arrange a replacement or full refund, including return shipping costs.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;
