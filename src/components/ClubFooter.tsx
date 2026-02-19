import clubBadge from "@/assets/club-badge.png";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const ClubFooter = () => {
  return (
    <footer className="bg-club-dark border-t border-primary/20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <img src={clubBadge} alt="Club Badge" className="h-14 w-14 object-contain" />
            <div>
              <h4 className="font-heading text-lg uppercase text-primary-foreground tracking-wider">
                Whitehawk FC
              </h4>
              <p className="text-primary-foreground/50 text-xs font-body mt-1">
                TerraPura Ground, East Brighton Park<br />
                Brighton, BN2 5TS
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li className="hover:text-primary cursor-pointer transition-colors">Fixtures & Results</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Latest News</li>
              <li className="hover:text-primary cursor-pointer transition-colors">First Team Squad</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Club History</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Tickets</li>
            </ul>
          </div>

          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
              The Club
            </h5>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li className="hover:text-primary cursor-pointer transition-colors">Hire Our Pitch</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Hire Our Clubhouse</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Sponsor Pack</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
              Follow Us
            </h5>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 flex items-center justify-center rounded-sm bg-primary-foreground/10 text-primary-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-primary-foreground/40 text-xs font-body mt-4">
              @whitehawkfc
            </p>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-6 text-center">
          <p className="text-primary-foreground/30 text-xs font-body">
            © 2026 Whitehawk FC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClubFooter;
