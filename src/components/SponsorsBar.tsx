const SponsorsBar = () => {
  return (
    <section className="py-8 bg-muted border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="font-heading text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Proud to be sponsored by
        </p>
        <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
          {["Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4", "Sponsor 5"].map((s) => (
            <div key={s} className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsBar;
