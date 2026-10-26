import { motion } from "framer-motion";

const CookiePolicy = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Legal Information
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Cookie Policy
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
              This Cookie Policy explains how Whitehawk Football Club uses cookies and similar technologies to recognize you when you visit our website (https://whitehawkfc.com). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">1. What are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">2. Why do we use Cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as accessing secure areas, using the shopping cart, and checking out.</li>
              <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use (for example, remembering your cart items).</li>
              <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">3. How can you control Cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted (for example, you may not be able to maintain items in your shopping cart).
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CookiePolicy;
