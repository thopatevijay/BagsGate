import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-gradient">Bags</span>Gate
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/explore" className="text-sm text-zinc-400 hover:text-white transition hidden sm:block">
              Explore
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg transition btn-glow"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-5 sm:px-8 py-24 sm:py-36 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7c3aed]/8 blur-[100px]" />
        </div>

        <div className="relative max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-sm text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Built on Bags.fm
          </div>

          <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ animationDelay: "80ms" }}>
            Gate your content.{" "}
            <span className="text-gradient">Earn from every trade.</span>
          </h1>

          <p className="animate-fade-up text-lg text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed" style={{ animationDelay: "160ms" }}>
            Launch a social token. Gate exclusive content behind it. Fans buy to access — you earn fee-sharing on every trade, forever.
          </p>

          <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
            <Link
              href="/login?role=creator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-7 py-3 rounded-xl font-semibold transition btn-glow"
            >
              Start as Creator
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white px-7 py-3 rounded-xl font-semibold transition"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800/60 py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14 tracking-tight">
            Three steps to <span className="text-gradient">monetize forever</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Launch your token",
                desc: "Create a social token on Bags with built-in fee-sharing. Set your revenue splits.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
              },
              {
                step: "02",
                title: "Gate your content",
                desc: "Set a token threshold. Fans who hold enough unlock your exclusive posts, media, and files.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
              },
              {
                step: "03",
                title: "Earn forever",
                desc: "Every buy and sell generates trading fees. Your share is automatic — no cuts, no delays.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
              },
            ].map((item) => (
              <div key={item.step} className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 card-hover">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-600">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-1.5">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-zinc-800/60 py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { val: "$4M", label: "Hackathon Pool" },
            { val: "100%", label: "On-chain Verified" },
            { val: "0%", label: "Platform Lock-in" },
            { val: "24/7", label: "Fee Earnings" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-gradient mb-1">{s.val}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/60 py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">Ready to own your audience?</h2>
          <p className="text-zinc-400 mb-8">
            Join creators building direct relationships with fans through token-gated access on Solana.
          </p>
          <Link
            href="/login?role=creator"
            className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-3.5 rounded-xl font-semibold transition btn-glow"
          >
            Launch Your Token
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/40 py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span>BagsGate &mdash; Token-gated creator access on Solana</span>
          <div className="flex gap-5">
            <a href="https://github.com/thopatevijay/BagsGate" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            <a href="https://bags.fm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Bags.fm</a>
            <a href="https://docs.bags.fm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
