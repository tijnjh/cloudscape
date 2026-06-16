import type { PropsWithChildren } from 'react'

export default function Collapsible({
  children,
  summary,
}: PropsWithChildren<{ summary: string }>) {
  return (
    <details className="relative overflow-hidden">
      <summary className="mb-2 w-fit cursor-pointer rounded-md bg-base-300-700 px-4 py-1">
        {summary}
      </summary>
      <div className="mb-32 pt-2">
        {children}
      </div>
    </details>
  )
}
