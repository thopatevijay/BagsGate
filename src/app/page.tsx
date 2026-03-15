import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d14]">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 border-b border-[#252838] bg-[#0b0d14]/90 backdrop-blur-md">
        <nav className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold tracking-tight">
            <span className="text-gradient">Bags</span>
            <span className="text-[#eeeef0]">Gate</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-[13px] text-[#8b8fa3] hover:text-[#eeeef0] transition-colors hidden sm:block">
              Explore
            </Link>
            <Link href="/explore/leaderboard" className="text-[13px] text-[#8b8fa3] hover:text-[#eeeef0] transition-colors hidden sm:block">
              Leaderboard
            </Link>
            <Link
              href="/login"
              className="text-[13px] font-semibold btn-primary px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative px-6 pt-28 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full bg-[#7c3aed]/[0.07] blur-[100px]" />
          <div className="absolute top-[60%] left-[30%] w-[320px] h-[200px] rounded-full bg-[#6366f1]/[0.04] blur-[80px]" />
        </div>

        <div className="relative max-w-[720px] mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full bg-[#141620] border border-[#252838] text-[13px] text-[#8b8fa3]">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            Built on Bags.fm &middot; Powered by Solana
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up text-[40px] sm:text-[52px] md:text-[60px] font-extrabold tracking-[-0.025em] leading-[1.1] text-[#eeeef0] mb-5"
            style={{ animationDelay: "80ms" }}
          >
            Gate your content.
            <br />
            <span className="text-gradient">Earn from every trade.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up text-[16px] sm:text-[18px] text-[#8b8fa3] leading-[1.7] max-w-[520px] mx-auto mb-10"
            style={{ animationDelay: "160ms" }}
          >
            Launch a social token. Gate your exclusive content behind it.
            Fans buy to access — you earn fee-sharing revenue on every trade, forever.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/login?role=creator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-primary px-7 py-3 rounded-[10px] text-[15px] font-semibold"
            >
              Start as Creator
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center btn-outline px-7 py-3 rounded-[10px] text-[15px] font-semibold"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="px-6 py-24 sm:py-28 border-t border-[#1a1c28]">
        <div className="max-w-[1040px] mx-auto">
          <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5a5e78] mb-3">
            How it works
          </p>
          <h2 className="text-[24px] sm:text-[30px] font-bold text-center text-[#eeeef0] tracking-tight mb-14">
            Three steps to <span className="text-gradient">monetize forever</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Launch your token",
                desc: "Create a social token on Bags with built-in fee-sharing. Configure your revenue splits — you earn on every trade.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Gate your content",
                desc: "Set a token threshold. Fans who hold enough unlock your exclusive posts, media, files, and communities.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Earn forever",
                desc: "Every buy and sell generates trading fees. Your share is automatic — no subscriptions, no platform cuts, no delays.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="elevated-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/[0.08] border border-[#7c3aed]/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono text-[#3d4059] tracking-widest">{item.step}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-[#eeeef0] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[#8b8fa3] leading-[1.65]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="px-6 py-20 border-t border-[#1a1c28]">
        <div className="max-w-[900px] mx-auto">
          <div className="elevated-card grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#252838]">
            {[
              { val: "$4M", label: "Hackathon Pool" },
              { val: "100%", label: "On-chain Verified" },
              { val: "0%", label: "Platform Lock-in" },
              { val: "24/7", label: "Fee Earnings" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-4 text-center">
                <p className="text-[28px] sm:text-[32px] font-extrabold text-gradient tracking-tight mb-1">{s.val}</p>
                <p className="text-[12px] text-[#5a5e78] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="px-6 py-24 sm:py-28 border-t border-[#1a1c28]">
        <div className="max-w-[560px] mx-auto text-center">
          <h2 className="text-[24px] sm:text-[30px] font-bold text-[#eeeef0] tracking-tight mb-4">
            Ready to own your audience?
          </h2>
          <p className="text-[15px] text-[#8b8fa3] leading-[1.7] mb-9">
            Join creators building direct relationships with their fans through token-gated access on Solana.
          </p>
          <Link
            href="/login?role=creator"
            className="inline-flex items-center gap-2 btn-primary px-8 py-3.5 rounded-[10px] text-[15px] font-semibold"
          >
            Launch Your Token
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#1a1c28] py-8 px-6">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[12px] text-[#5a5e78]">
            BagsGate &mdash; Token-gated creator access on Solana
          </span>
          <div className="flex gap-6">
            <a href="https://github.com/thopatevijay/BagsGate" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#5a5e78] hover:text-[#d1d1d6] transition-colors">
              GitHub
            </a>
            <a href="https://bags.fm" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#5a5e78] hover:text-[#d1d1d6] transition-colors">
              Bags.fm
            </a>
            <a href="https://docs.bags.fm" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#5a5e78] hover:text-[#d1d1d6] transition-colors">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
