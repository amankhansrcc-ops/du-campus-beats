import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Overlay({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-background/50 backdrop-blur-[2px]"
      />
      <section className="glass animate-sheet-up relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[28px] sm:max-h-[76vh] sm:max-w-3xl sm:rounded-[26px]">
        <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <h2 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-hairline p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">{children}</div>
        {footer && <div className="border-t border-hairline px-5 py-3 sm:px-7">{footer}</div>}
      </section>
    </div>
  );
}
