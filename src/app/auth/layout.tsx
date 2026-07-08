export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-foreground text-background">
      <div
        aria-hidden
        className="from-primary/30 via-accent/10 to-transparent pointer-events-none absolute inset-0 bg-gradient-to-br"
      />
      <div
        aria-hidden
        className="from-accent/25 via-transparent to-primary/20 pointer-events-none absolute inset-0 bg-gradient-to-tl"
      />
      <div className="relative flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
