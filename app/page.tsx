export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-4">

      <h1 className="text-foreground text-2xl font-semibold">
        Systemos
      </h1>

      <p className="text-muted-foreground text-sm">
        Testing the design system
      </p>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-foreground text-sm">Card component</p>
        <p className="text-muted-foreground text-xs mt-1">Secondary text inside a card</p>
      </div>

      <button className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer w-fit">
        Primary button
      </button>

      <button className="bg-transparent text-foreground border border-border rounded-lg px-5 py-2.5 text-sm cursor-pointer w-fit">
        Secondary button
      </button>

      <div className="flex gap-2">
        <span className="bg-primary/15 text-accent border border-primary/30 rounded-full px-3 py-0.5 text-xs font-medium">
          Brand badge
        </span>
        <span className="bg-destructive/15 text-destructive border border-destructive/30 rounded-full px-3 py-0.5 text-xs font-medium">
          Danger badge
        </span>
        <span className="bg-warning/15 text-warning border border-warning/30 rounded-full px-3 py-0.5 text-xs font-medium">
          Warning badge
        </span>
      </div>

      <input
        type="text"
        placeholder="Test input..."
        className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none w-72 placeholder:text-muted-foreground focus:border-primary/60"
      />

    </div>
  )
}