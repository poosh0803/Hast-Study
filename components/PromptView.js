export default function PromptView({ item }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      {item.topic && <p className="mt-1 text-sm text-foreground/50">{item.topic}</p>}
      <p className="mt-6 text-sm text-foreground/60">
        No dedicated view built for this content shape yet — showing the raw fields below.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-foreground/10 bg-foreground/[.03] p-4 text-xs">
        {JSON.stringify(item, null, 2)}
      </pre>
    </div>
  );
}
