import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const ClubFooter = () => {
  return (
    <footer className="bg-club-dark border-t border-primary-foreground/10 pb-20 lg:pb-0">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="flex items-start gap-4">
            <img
              src="https://whitehawkfc.com/wp-content/uploads/2023/04/cropped-twitter-badge-round.png"
              alt="Whitehawk FC"
              className="h-16 w-16 object-contain shrink-0"
            />
            <div>
              <h4 className="font-heading text-xl text-primary-foreground tracking-tight font-bold leading-tight">
                Whitehawk<br />
                <span className="text-primary">Football Club</span>
              </h4>
              <p className="text-primary-foreground/40 text-xs font-body mt-2 leading-relaxed">
                TerraPura Ground, East Brighton Park<br />
                Brighton, BN2 5TS
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-heading text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4 font-semibold">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-sm text-primary-foreground/40 font-body">
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Fixtures & Results</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Latest News</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">First Team Squad</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Club History</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Tickets</li>
            </ul>
          </div>

          <div>
            <h5 className="font-heading text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4 font-semibold">
              The Club
            </h5>
            <ul className="space-y-2.5 text-sm text-primary-foreground/40 font-body">
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Hire Our Pitch</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Hire Our Clubhouse</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Sponsor Pack</li>
              <li className="hover:text-primary-foreground cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

          <div>
            <h5 className="font-heading text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-4 font-semibold">
              Follow Us
            </h5>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-primary-foreground/30 text-xs font-body mt-4">
              @whitehawkfc
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/5 mt-10 pt-8 text-center">
          <p className="text-primary-foreground/25 text-xs font-body">
            © 2026 Whitehawk FC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClubFooter;
