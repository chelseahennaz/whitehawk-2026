import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock, ExternalLink, Users, Megaphone, Handshake, Heart } from "lucide-react";
import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contacts = [
  {
    title: "General Enquiries",
    icon: Mail,
    description: "For any general questions about the club, matchdays, or events.",
    email: "info@whitehawkfc.com",
  },
  {
    title: "Commercial & Sponsorship",
    icon: Handshake,
    description: "Interested in sponsoring the Hawks or advertising at the TerraPura Ground?",
    email: "commercial@whitehawkfc.com",
  },
  {
    title: "Media & Press",
    icon: Megaphone,
    description: "Press accreditation, interview requests and media enquiries.",
    email: "media@whitehawkfc.com",
  },
  {
    title: "Youth & Academy",
    icon: Users,
    description: "Enquiries about the youth pathway, trials, and junior football.",
    email: "youth@whitehawkfc.com",
  },
  {
    title: "Community & Volunteering",
    icon: Heart,
    description: "Want to volunteer on matchdays or get involved with community projects?",
    email: "community@whitehawkfc.com",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />

      <main className="pt-[90px] md:pt-[124px]">
        {/* Hero */}
        <section className="bg-club-dark py-16 md:py-24">
          <div className="container mx-auto px-4">
            <p className="mb-2 font-heading text-sm uppercase tracking-widest text-club-gold">
              Get In Touch
            </p>
            <h1 className="font-heading text-4xl font-bold uppercase leading-none text-primary-foreground md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-2xl font-body text-base text-primary-foreground/70">
              Whether you&apos;re a supporter, sponsor, journalist or just want to find out more about the Hawks, we&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Ground Info + Map */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-2xl border border-border shadow-sm"
              >
                <iframe
                  title="TerraPura Ground Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.6!2d-0.1098!3d50.8372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48758590c4b0b3c5%3A0x3d52cbb6e0e0b0a0!2sThe%20Enclosed%20Ground%2C%20Wilson%20Ave%2C%20Brighton%20BN2%205TS!5e0!3m2!1sen!2suk!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>

              {/* Ground Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <p className="mb-2 font-heading text-xs uppercase tracking-[0.3em] text-primary">
                  Our Home
                </p>
                <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">
                  The TerraPura Ground
                </h2>
                <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
                  Home of Whitehawk FC since the club&apos;s founding, the TerraPura Ground sits in East Brighton Park and has been the heart of Hawks football for generations. The ground is accessible by bus and has limited parking nearby.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">Address</p>
                      <p className="font-body text-sm text-muted-foreground">
                        The TerraPura Ground<br />
                        East Brighton Park, Wilson Avenue<br />
                        Brighton BN2 5TS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">Matchdays</p>
                      <p className="font-body text-sm text-muted-foreground">
                        Gates typically open 1 hour before kick-off.<br />
                        Saturday 3:00 PM &middot; Tuesday 7:45 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">Phone</p>
                      <p className="font-body text-sm text-muted-foreground">
                        Matchday enquiries only
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=TerraPura+Ground+Wilson+Avenue+Brighton+BN2+5TS"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-5 py-2.5 font-heading text-xs uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Get Directions <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="border-t border-border bg-muted/30 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-2xl">
              <p className="mb-2 font-heading text-xs uppercase tracking-[0.3em] text-primary">
                Departments
              </p>
              <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">
                Who To Contact
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                Reach the right people at the club. All enquiries are handled by volunteers, so please allow a few days for a response.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact, i) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="h-full border-border bg-card/95 transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <contact.icon size={18} />
                      </div>
                      <CardTitle className="font-heading text-base uppercase tracking-wide text-foreground">
                        {contact.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
                        {contact.description}
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-heading text-xs uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                      >
                        {contact.email}
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2 font-heading text-xs uppercase tracking-[0.3em] text-primary">Follow The Hawks</p>
            <h3 className="font-heading text-2xl font-bold uppercase text-foreground md:text-3xl">
              Find Us Online
            </h3>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
              Stay connected with the latest news, matchday content and behind-the-scenes updates.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "Twitter / X", href: "https://twitter.com/whitaborhawks" },
                { label: "Instagram", href: "https://instagram.com/whitehawkfc" },
                { label: "Facebook", href: "https://facebook.com/WhitehawkFootballClub" },
                { label: "Official Site", href: "https://whitehawkfc.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-border bg-background px-5 py-2.5 font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ClubFooter />
    </div>
  );
};

export default Contact;
