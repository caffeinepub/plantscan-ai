import { Heart, Leaf } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
    window.location.hostname,
  )}`;

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
            <Leaf className="w-3 h-3 text-primary" />
          </div>
          <span className="font-display font-semibold text-foreground text-xs tracking-wide">
            Plant Beta AI
          </span>
          <span className="text-xs">— Protect your crops with AI insights</span>
        </div>
        <p className="text-xs flex items-center gap-1">
          © {year}. Built with{" "}
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> using{" "}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
