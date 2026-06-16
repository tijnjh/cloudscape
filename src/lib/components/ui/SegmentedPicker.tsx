import type { ClassValue } from 'cnfn'
import { cn } from 'cnfn'
import Button from './Button'

export default function SegmentedPicker<T extends readonly string[]>({
  options,
  current,
  onChange,
  className,
}: {
  options: T
  current?: T[number]
  onChange?: (value: T[number]) => void
  className?: ClassValue
}) {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map(option => (
        <Button
          key={`${current}-${option}`}
          variant={current === option ? 'primary' : 'secondary'}
          onClick={() => onChange?.(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  )
}
