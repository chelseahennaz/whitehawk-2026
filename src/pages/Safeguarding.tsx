import { motion } from "framer-motion";
import { Shield, Mail, Phone, AlertTriangle } from "lucide-react";

const Safeguarding = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-border/50 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="mb-2 font-heading text-sm uppercase tracking-[0.3em] font-bold text-[#8e160b]">
            Club Policy
          </p>
          <h1 className="font-heading text-4xl font-bold uppercase leading-tight text-black md:text-6xl tracking-tighter">
            Safeguarding
          </h1>
          <p className="mt-4 font-body text-sm text-muted-foreground">
            Whitehawk Football Club is committed to safeguarding children, young people, and vulnerable adults.
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
            <div className="flex gap-4 p-5 rounded-xl bg-[#8e160b]/5 border border-[#8e160b]/10 text-black">
              <Shield className="text-[#8e160b] shrink-0" size={24} />
              <div>
                <h4 className="font-heading text-sm uppercase tracking-wider font-bold text-[#8e160b] mb-1">
                  Safeguarding is Everyone&apos;s Responsibility
                </h4>
                <p className="text-sm text-muted-foreground">
                  At Whitehawk FC, the health, safety, and welfare of every child and young person are of paramount importance. We subscribe to The Football Association’s (The FA) Safeguarding Children Policy and Procedures.
                </p>
              </div>
            </div>

            <p>
              Whitehawk Football Club acknowledges its responsibility to safeguard the welfare of every child and young person (defined as anyone under the age of 18) who has been entrusted to its care. We are committed to working to provide a safe and positive environment for all participants.
            </p>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">Our Key Principles</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The child&apos;s welfare is, and must always be, the paramount consideration.</li>
              <li>All children and young people have a right to be protected from abuse, regardless of their age, gender, disability, race, sexual orientation, or religious beliefs.</li>
              <li>All suspicions and allegations of abuse will be taken seriously and responded to swiftly and appropriately.</li>
              <li>Working in partnership with other organizations, children, and their parents/carers is essential to promote their welfare.</li>
            </ul>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8">Reporting Concerns & Contact Information</h2>
            <p>
              If you have a safeguarding concern or require advice regarding a child, young person, or vulnerable adult at our club, please contact our Safeguarding Team immediately:
            </p>

            {/* Contact Details Card */}
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="p-5 border border-border rounded-xl bg-card">
                <p className="font-heading text-xs uppercase tracking-widest text-[#8e160b] font-bold mb-2">Club Welfare Officer (CWO)</p>
                <h3 className="font-heading text-lg font-bold text-black mb-3">Kay Stringer</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="mailto:kaystringer@whitehawkfc.com" className="flex items-center gap-2 hover:text-[#8e160b] transition-colors">
                    <Mail size={16} /> kaystringer@whitehawkfc.com
                  </a>
                  <a href="tel:07756602784" className="flex items-center gap-2 hover:text-[#8e160b] transition-colors">
                    <Phone size={16} /> 07756 602784
                  </a>
                </div>
              </div>

              <div className="p-5 border border-border rounded-xl bg-card">
                <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Alternative Contacts</p>
                <h3 className="font-heading text-lg font-bold text-black mb-3">General Enquiries</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a href="mailto:club@whitehawkfc.com" className="flex items-center gap-2 hover:text-[#8e160b] transition-colors">
                    <Mail size={16} /> club@whitehawkfc.com
                  </a>
                </div>
              </div>
            </div>

            <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide mt-8 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} /> If you cannot reach the CWO or if a child is in immediate danger:
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact the Sussex County FA Designated Safeguarding Officer.</li>
              <li>Contact The FA&apos;s Safeguarding Team on <strong>0800 169 1863</strong> or email <a href="mailto:Safeguarding@TheFA.com" className="text-[#8e160b] hover:underline font-semibold">Safeguarding@TheFA.com</a>.</li>
              <li>Contact the NSPCC Helpline on <strong>0808 800 5000</strong>.</li>
              <li>Call the Police (<strong>999</strong> in an emergency or <strong>101</strong> for non-emergencies) or Children&apos;s Social Care.</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Safeguarding;
