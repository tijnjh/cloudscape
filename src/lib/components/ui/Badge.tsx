export default function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-accent/15 px-2 py-0.5 text-sm whitespace-nowrap text-accent">
      {label}
    </div>
  )
}
