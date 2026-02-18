import clubBadge from "@/assets/club-badge.png";

const ClubFooter = () => {
  return (
    <footer className="bg-club-dark border-t border-primary/20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3">
            <img src={clubBadge} alt="Club Badge" className="h-14 w-14 object-contain" />
            <div>
              <h4 className="font-heading text-lg uppercase text-primary-foreground tracking-wider">
                Your Club FC
              </h4>
              <p className="text-primary-foreground/50 text-xs font-body mt-1">
                The Red Ground, High Street<br />
                Your Town, YT1 2AB
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
            </ul>
          </div>

          <div>
            <h5 className="font-heading text-sm uppercase tracking-widest text-primary-foreground/70 mb-3">
              Follow Us
            </h5>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li className="hover:text-primary cursor-pointer transition-colors">Twitter / X</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Facebook</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Instagram</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-6 text-center">
          <p className="text-primary-foreground/30 text-xs font-body">
            © 2026 Your Club FC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ClubFooter;
