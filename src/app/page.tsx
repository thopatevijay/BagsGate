import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[oklch(0.541_0.281_293.009_/_0.06)] blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-[oklch(0.45_0.2_260_/_0.04)] blur-[120px]" />
        <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full bg-[oklch(0.541_0.281_293.009_/_0.03)] blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-border/50">
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-gradient">Bags</span>
            <span className="text-foreground">Gate</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/explore"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium bg-primary hover:bg-accent-light text-primary-foreground px-4 py-2 rounded-lg transition-all hover:shadow-[0_0_20px_oklch(0.541_0.281_293.009_/_0.3)]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-8 py-20 sm:py-32">
        <div className="max-w-3xl text-center">
          <div
            className="animate-fade-up inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/50 text-sm text-muted-foreground"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Built on Bags.fm &middot; Powered by Solana
          </div>

          <h1
            className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
            style={{ animationDelay: "100ms" }}
          >
            Gate your content.
            <br />
            <span className="text-gradient">Earn from every trade.</span>
          </h1>

          <p
            className="animate-fade-up text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ animationDelay: "200ms" }}
          >
            Launch a social token. Gate your exclusive content behind it.
            Fans buy to access — you earn fee-sharing revenue on every buy
            and sell, forever.
          </p>

          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/login?role=creator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent-light text-primary-foreground px-7 py-3 rounded-xl font-semibold text-base transition-all animate-pulse-glow hover:shadow-[0_0_30px_oklch(0.541_0.281_293.009_/_0.4)]"
            >
              Start as Creator
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-border hover:border-border/80 hover:bg-secondary/50 text-foreground px-7 py-3 rounded-xl font-semibold text-base transition-all"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="relative z-10 border-t border-border/40 py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-center text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3"
          >
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16">
            Three steps to <span className="text-gradient">monetize forever</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Launch your token",
                desc: "Create a social token on Bags with built-in fee-sharing. Configure your revenue splits — you earn on every trade.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Gate your content",
                desc: "Set a token threshold. Fans who hold enough tokens unlock your exclusive posts, media, files, and communities.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Earn forever",
                desc: "Every buy and sell generates trading fees. You earn your share automatically — no subscriptions, no platform cuts, no delays.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="group relative bg-card/60 backdrop-blur border border-border/60 rounded-2xl p-7 card-hover"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground/50 tracking-wider">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / social proof */}
      <section className="relative z-10 border-t border-border/40 py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "$4M", label: "Hackathon Pool" },
              { value: "100%", label: "On-chain Verified" },
              { value: "0%", label: "Platform Lock-in" },
              { value: "24/7", label: "Fee Earnings" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-border/40 py-24 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
            Ready to own your audience?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Join creators who are building direct relationships with their fans through token-gated access on Solana.
          </p>
          <Link
            href="/login?role=creator"
            className="inline-flex items-center gap-2 bg-primary hover:bg-accent-light text-primary-foreground px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-[0_0_30px_oklch(0.541_0.281_293.009_/_0.4)]"
          >
            Launch Your Token
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>BagsGate &mdash; Token-gated creator access on Solana</span>
          <div className="flex items-center gap-5">
            <a href="https://github.com/thopatevijay/BagsGate" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="https://bags.fm" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Bags.fm
            </a>
            <a href="https://docs.bags.fm" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
