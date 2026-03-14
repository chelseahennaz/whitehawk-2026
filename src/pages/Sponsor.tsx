import ClubNavigation from "@/components/ClubNavigation";
import FixturesTicker from "@/components/FixturesTicker";
import ClubFooter from "@/components/ClubFooter";
import { Check, Star, Trophy, Crown, Zap, Phone, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Tier {
  name: string;
  price: string;
  period: string;
  tagline: string;
  icon: React.ReactNode;
  featured?: boolean;
  color: string;
  perks: string[];
}

const tiers: Tier[] = [
  {
    name: "Classic",
    price: "£250",
    period: "per season",
    tagline: "Show your support for the Hawks",
    icon: <Zap size={24} />,
    color: "bg-muted text-foreground",
    perks: [
      "Logo on club website sponsors page",
      "Social media shout-out on signing",
      "2× season tickets",
      "Name in matchday programme",
      "Invitation to end-of-season awards",
    ],
  },
  {
    name: "Signature",
    price: "£500",
    period: "per season",
    tagline: "Visible presence across the club",
    icon: <Star size={24} />,
    color: "bg-primary/10 text-primary",
    perks: [
      "Everything in Classic, plus:",
      "Pitchside advertising board",
      "Logo on digital matchday programme",
      "4× season tickets",
      "Quarterly social media features",
      "10% discount on clubhouse hire",
    ],
  },
  {
    name: "Prestige",
    price: "£1,000",
    period: "per season",
    tagline: "Premium brand visibility",
    icon: <Trophy size={24} />,
    featured: true,
    color: "club-gradient text-primary-foreground",
    perks: [
      "Everything in Signature, plus:",
      "Logo on training wear",
      "Half-page programme advert",
      "6× season tickets",
      "Sponsor a match (hospitality for 4)",
      "Monthly social media campaign",
      "Logo on club email newsletters",
    ],
  },
  {
    name: "Elite",
    price: "£2,500+",
    period: "per season",
    tagline: "Headline partner of Whitehawk FC",
    icon: <Crown size={24} />,
    color: "bg-club-dark text-primary-foreground",
    perks: [
      "Everything in Prestige, plus:",
      "Logo on matchday shirt (front or sleeve)",
      "Full-page programme advert",
      "10× season tickets",
      "VIP hospitality at every home match",
      "Exclusive stadium naming / stand rights",
      "Press & PR coverage as headline sponsor",
      "Priority access to player appearances",
    ],
  },
];

const additionalOpportunities = [
  {
    title: "Match Sponsorship",
    description: "Host a VIP matchday for you and your guests. Includes hospitality, programme recognition, and pitch-side branding.",
    price: "From £150",
  },
  {
    title: "Player Sponsorship",
    description: "Put your brand alongside a first-team player. Logo on their profile, social features, and signed shirt at season end.",
    price: "From £100",
  },
  {
    title: "Matchday Programme Ad",
    description: "Reach hundreds of fans every home game with a quarter, half, or full-page advert in our printed programme.",
    price: "From £50",
  },
  {
    title: "Pitch Hire Naming",
    description: "Brand our 3G pitch with your company name. Visible to thousands of community users each week.",
    price: "POA",
  },
];

const Sponsor = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClubNavigation />
      <FixturesTicker />
      <main className="pt-[90px] md:pt-[124px]">
        {/* Hero */}
        <section className="club-gradient py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0djJ')] opacity-30" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-heading text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
                Partner with Us
              </p>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase text-primary-foreground leading-none mb-6">
                Sponsor <br className="md:hidden" />Whitehawk FC
              </h1>
              <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Join our family. Grow your brand with Brighton's community football club — reaching thousands of fans, players, and local residents every week.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#packages">
                  <Button size="lg" variant="secondary" className="font-heading uppercase tracking-wider text-sm gap-2">
                    View Packages <ArrowRight size={16} />
                  </Button>
                </a>
                <a href="tel:02045827336">
                  <Button size="lg" variant="ghost" className="font-heading uppercase tracking-wider text-sm text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 gap-2">
                    <Phone size={16} /> Call John
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Sponsor */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-heading text-sm uppercase tracking-widest text-primary mb-2">Why Whitehawk?</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-foreground">
                More Than a Club
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { stat: "500+", label: "Matchday attendance", desc: "Engaged, loyal fans at every home game" },
                { stat: "5,000+", label: "Social media reach", desc: "Growing digital audience across platforms" },
                { stat: "200+", label: "Community players", desc: "Youth, women's & walking football teams" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-heading text-5xl font-bold text-primary">{item.stat}</p>
                  <p className="font-heading text-sm uppercase tracking-wider text-foreground mt-2">{item.label}</p>
                  <p className="font-body text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-heading text-sm uppercase tracking-widest text-primary mb-2">Sponsorship Tiers</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-foreground">
                Choose Your Package
              </h2>
              <p className="font-body text-muted-foreground mt-3 max-w-lg mx-auto">
                Flexible packages to suit every budget. All prices are per season — bespoke packages also available.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`relative rounded-xl border overflow-hidden flex flex-col ${
                    tier.featured
                      ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                      : "border-border"
                  } bg-card`}
                >
                  {tier.featured && (
                    <div className="club-gradient py-1.5 text-center">
                      <span className="font-heading text-[10px] uppercase tracking-widest text-primary-foreground">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tier.color}`}>
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold uppercase text-foreground">{tier.name}</h3>
                        <p className="font-body text-xs text-muted-foreground">{tier.tagline}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="font-heading text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="font-body text-sm text-muted-foreground ml-1">/{tier.period}</span>
                    </div>

                    <ul className="space-y-3 flex-1">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5">
                          <Check size={16} className="text-primary mt-0.5 shrink-0" />
                          <span className="font-body text-sm text-foreground/80">{perk}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`mailto:sponsor@whitehawkfc.com?subject=${tier.name} Sponsorship Enquiry`}
                      className="mt-6 block"
                    >
                      <Button
                        className="w-full font-heading uppercase tracking-wider text-sm"
                        variant={tier.featured ? "default" : "outline"}
                      >
                        Enquire Now
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Opportunities */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="font-heading text-sm uppercase tracking-widest text-primary mb-2">À La Carte</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-foreground">
                More Ways to Partner
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {additionalOpportunities.map((opp) => (
                <div
                  key={opp.title}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-heading text-sm font-bold uppercase text-foreground mb-2">{opp.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{opp.description}</p>
                  <p className="font-heading text-lg font-bold text-primary">{opp.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-club-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase text-primary-foreground mb-4">
              Ready to Get Involved?
            </h2>
            <p className="font-body text-primary-foreground/70 max-w-lg mx-auto mb-8">
              We'd love to chat about how a partnership with Whitehawk FC can work for your business. No hard sell — just a conversation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:02045827336">
                <Button size="lg" className="font-heading uppercase tracking-wider text-sm gap-2">
                  <Phone size={16} /> 020 4582 7336
                </Button>
              </a>
              <a href="mailto:sponsor@whitehawkfc.com">
                <Button size="lg" variant="outline" className="font-heading uppercase tracking-wider text-sm gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Mail size={16} /> Email Us
                </Button>
              </a>
            </div>
            <p className="font-body text-xs text-primary-foreground/40 mt-6">Ask for John — Club Commercial Manager</p>
          </div>
        </section>
      </main>
      <ClubFooter />
    </div>
  );
};

export default Sponsor;
