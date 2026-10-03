import { cn } from "@/lib/utils";

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue"; className?: string }) {
  const tones = { neutral: "bg-stone-100 text-stone-600", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", blue: "bg-blue-50 text-blue-700" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", tones[tone], className)}>{children}</span>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div>{eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[.22em] text-rust">{eyebrow}</p>}<h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">{title}</h1><p className="mt-2 max-w-2xl text-sm text-stone-500">{description}</p></div>
    {action && <div>{action}</div>}
  </div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="py-16 text-center"><div className="font-serif text-2xl">{title}</div><p className="mt-2 text-sm text-stone-500">{description}</p></div>;
}

export const statusTone = (status: string): "neutral" | "green" | "amber" | "red" | "blue" => {
  if (["completed", "confirmed", "purchase"].includes(status)) return "green";
  if (["pending", "reservation"].includes(status)) return "amber";
  if (["cancelled", "refunded", "expired"].includes(status)) return "red";
  if (["release", "adjustment"].includes(status)) return "blue";
  return "neutral";
};
