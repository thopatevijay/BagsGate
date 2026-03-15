import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            BagsGate
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/explore"
              className="text-muted hover:text-foreground transition"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="bg-accent hover:bg-accent-light text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Gate your content.
            <br />
            <span className="text-accent">Earn from every trade.</span>
          </h1>
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
            Launch a token on Bags. Gate your exclusive content behind it. Fans
            buy to access. You earn fee-sharing revenue on every buy and sell —
            forever.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login?role=creator"
              className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Start as Creator
            </Link>
            <Link
              href="/explore"
              className="border border-border hover:border-muted text-foreground px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-accent mb-3">1</div>
              <h3 className="text-lg font-semibold mb-2">Launch your token</h3>
              <p className="text-muted">
                Create a social token on Bags with built-in fee-sharing. Set
                your splits — you earn on every trade.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-accent mb-3">2</div>
              <h3 className="text-lg font-semibold mb-2">Gate your content</h3>
              <p className="text-muted">
                Set a token threshold. Fans who hold enough tokens unlock your
                exclusive posts, media, and files.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="text-3xl font-bold text-accent mb-3">3</div>
              <h3 className="text-lg font-semibold mb-2">Earn forever</h3>
              <p className="text-muted">
                Every buy and sell generates trading fees. You earn a share
                automatically — no subscriptions, no cuts, no delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted">
          <span>BagsGate — Built on Bags.fm</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/thopatevijay/BagsGate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
            >
              GitHub
            </a>
            <a
              href="https://bags.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
            >
              Bags.fm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
