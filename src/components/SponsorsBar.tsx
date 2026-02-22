const SponsorsBar = () => {
  return (
    <section className="py-10 md:py-14 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Proud to be sponsored by
        </p>
        <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
          {["Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4", "Sponsor 5"].map((s) => (
            <div
              key={s}
              className="font-heading text-sm uppercase tracking-wider text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-pointer"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsBar;
