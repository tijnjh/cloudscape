import { cn } from 'cnfast'
import { Button } from './Button'

export function SegmentedPicker<T extends readonly string[]>({
  options,
  current,
  onChange,
  className,
}: {
  options: T
  current?: T[number]
  onChange?: (value: T[number]) => void
  className?: string
}) {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map(option => (
        <Button
          key={option}
          variant={current === option ? 'primary' : 'secondary'}
          onClick={() => onChange?.(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  )
}
