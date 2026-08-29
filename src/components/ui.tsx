import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { useApp } from "../lib/store";

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  disabled,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "plain" | "danger";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  full?: boolean;
}) {
  const styles = {
    primary: "bg-[#00703c] text-white shadow-[0_4px_0_0_#002d18] hover:bg-[#005a30]",
    secondary: "bg-[#e8edf1] text-[#0b0c0c] shadow-[0_4px_0_0_#929191] hover:bg-[#dbe3e9]",
    plain: "bg-white text-[#12436d] border-2 border-[#12436d] hover:bg-[#f0f4f8]",
    danger: "bg-[#d4351c] text-white shadow-[0_4px_0_0_#55150b] hover:bg-[#aa2b16]",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[3px] px-5 py-3 text-lg font-bold transition active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function A({
  to,
  children,
  className,
  onClick,
}: {
  to?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { navigate } = useApp();
  return (
    <button
      onClick={() => {
        onClick?.();
        if (to) navigate(to);
      }}
      className={cn(
        "text-left text-[#1d70b8] underline decoration-2 underline-offset-4 hover:text-[#003078]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag: any = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "block w-full rounded-lg border-2 border-[#b1b4b6] bg-white p-5 text-left",
        onClick && "transition hover:border-[#12436d] hover:bg-[#f4f8fb] hover:shadow-md",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Callout({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
}) {
  const tones = {
    info: "border-[#1d70b8] bg-[#eef5fb]",
    success: "border-[#00703c] bg-[#eaf5ef]",
    warning: "border-[#f47738] bg-[#fdf1e9]",
    danger: "border-[#d4351c] bg-[#fcebe8]",
  }[tone];
  return (
    <div className={cn("rounded-md border-l-8 p-4", tones)}>
      {title && <p className="mb-1 text-lg font-bold">{title}</p>}
      <div className="text-lg leading-relaxed">{children}</div>
    </div>
  );
}

export function Tag({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "grey" | "orange" | "red" }) {
  const tones = {
    blue: "bg-[#d2e2f1] text-[#12436d]",
    green: "bg-[#cce2d8] text-[#005a30]",
    grey: "bg-[#eeefef] text-[#383f43]",
    orange: "bg-[#fcd6c3] text-[#6e3619]",
    red: "bg-[#f6d7d2] text-[#942514]",
  }[tone];
  return (
    <span className={cn("inline-block rounded-sm px-2 py-1 text-sm font-bold tracking-wide uppercase", tones)}>
      {children}
    </span>
  );
}

export function PageTitle({
  title,
  caption,
  intro,
  speakText,
}: {
  title: string;
  caption?: string;
  intro?: string;
  speakText?: string;
}) {
  const { speak, t } = useApp();
  return (
    <header className="mb-6">
      {caption && <p className="text-xl font-medium text-[#505a5f]">{caption}</p>}
      <h1 className="text-3xl leading-tight font-extrabold sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-xl leading-relaxed text-[#2b3236]">{intro}</p>}
      {(speakText || intro) && (
        <button
          onClick={() => speak(`${title}. ${speakText || intro || ""}`)}
          className="no-print mt-3 inline-flex items-center gap-2 rounded-full border-2 border-[#12436d] px-3 py-1 text-base font-bold text-[#12436d] hover:bg-[#f0f4f8]"
        >
          {t("Read this page aloud", "यह पेज सुनें")}
        </button>
      )}
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  const { navigate } = useApp();
  return (
    <nav className="no-print mb-5 flex flex-wrap items-center gap-2 text-base text-[#505a5f]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>›</span>}
          {item.to ? (
            <button
              onClick={() => navigate(item.to!)}
              className="text-[#1d70b8] underline underline-offset-4"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-[#0b0c0c]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Field({
  label,
  hint,
  children,
  error,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-lg font-bold">{label}</span>
      {hint && <span className="mt-1 block text-base text-[#505a5f]">{hint}</span>}
      {error && <span className="mt-1 block text-base font-bold text-[#d4351c]">{error}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-[3px] border-2 border-[#0b0c0c] bg-white px-3 py-3 text-lg focus:border-[#0b0c0c]";

export function ChoiceCard({
  selected,
  onSelect,
  title,
  desc,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc?: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition",
        selected ? "border-[#00703c] bg-[#eaf5ef] shadow-md" : "border-[#b1b4b6] bg-white hover:border-[#12436d]",
      )}
    >
      <span
        className={cn(
          "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-[#00703c] bg-[#00703c] text-white" : "border-[#6f777b] bg-white",
        )}
        aria-hidden
      >
        {selected ? "✓" : ""}
      </span>
      <span>
        <span className="block text-lg font-bold">{title}</span>
        {desc && <span className="mt-1 block text-base text-[#505a5f]">{desc}</span>}
      </span>
    </button>
  );
}

export function Steps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <ol className="no-print mb-6 flex flex-wrap gap-2">
      {labels.map((l, i) => (
        <li
          key={l}
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1 text-base font-bold",
            i === current
              ? "bg-[#12436d] text-white"
              : i < current
                ? "bg-[#cce2d8] text-[#005a30]"
                : "bg-[#eeefef] text-[#505a5f]",
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-sm">
            {i < current ? "✓" : i + 1}
          </span>
          {l}
        </li>
      ))}
    </ol>
  );
}

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y-2 divide-[#b1b4b6] border-y-2 border-[#b1b4b6]">
      {items.map((item, i) => (
        <details key={i} className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-bold text-[#1d70b8]">
            <span>{item.q}</span>
            <span className="text-2xl transition group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <div className="mt-3 text-lg leading-relaxed text-[#2b3236]">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
