import { Link } from "@tanstack/react-router";
import { BookOpen, History, Leaf, MessageCircle, ScanLine } from "lucide-react";

const features = [
  {
    to: "/scan",
    icon: ScanLine,
    label: "Scan Plant",
    description:
      "Upload a photo and get AI-powered disease predictions instantly.",
    ocid: "home.scan_link",
  },
  {
    to: "/library",
    icon: BookOpen,
    label: "Disease Library",
    description:
      "Browse our catalog of plant diseases with symptoms and treatments.",
    ocid: "home.library_link",
  },
  {
    to: "/history",
    icon: History,
    label: "Scan History",
    description: "Review your past analyses and track plant health over time.",
    ocid: "home.history_link",
  },
  {
    to: "/chat",
    icon: MessageCircle,
    label: "PlantBot Chat",
    description: "Ask our AI assistant anything about plant diseases and care.",
    ocid: "home.chat_link",
  },
];

export function HomePage() {
  return (
    <main className="flex-1 flex flex-col" data-ocid="home.page">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-24 gap-6 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/uploads/image-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="home.section"
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-botanical">
          <Leaf className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="relative z-10 flex flex-col gap-2 max-w-xl">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight drop-shadow-lg">
            Plant Beta AI
          </h1>
          <p className="text-white/80 text-lg drop-shadow">
            Identify plant diseases instantly using CNN-powered image analysis.
            Protect your crops before it's too late.
          </p>
        </div>
        <Link
          to="/scan"
          data-ocid="home.primary_button"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-botanical hover:opacity-90 transition-opacity"
        >
          <ScanLine className="w-4 h-4" />
          Start Scanning
        </Link>
      </section>

      {/* Feature cards */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ to, icon: Icon, label, description, ocid }) => (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className="group flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">{label}</span>
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
