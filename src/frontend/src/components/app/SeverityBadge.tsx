import type { Severity } from "../../data/diseases";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { label: string; className: string; dot: string }
> = {
  Low: {
    label: "Low",
    className: "severity-low",
    dot: "bg-green-200",
  },
  Medium: {
    label: "Medium",
    className: "severity-medium",
    dot: "bg-yellow-200",
  },
  High: {
    label: "High",
    className: "severity-high",
    dot: "bg-orange-200",
  },
  Critical: {
    label: "Critical",
    className: "severity-critical",
    dot: "bg-red-200",
  },
};

export function SeverityBadge({
  severity,
  className = "",
}: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${config.className} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}
