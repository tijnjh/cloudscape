import type { InputProps as InputPrimitiveProps } from '@base-ui/react/input'
import type { LucideIcon } from 'lucide-react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from 'cnfn'
import { XIcon } from 'lucide-react'
import { Button } from './Button'

export interface InputProps extends InputPrimitiveProps {
  icon?: LucideIcon
  onClear?: VoidFunction
}

export function Input({ className, icon: Icon, onClear, value, ...props }: InputProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 items-center gap-2 overflow-clip rounded-full bg-base-300-700 pl-4 ring-blue-500 focus-within:ring-2',
        className,
      )}
    >
      {Icon && <Icon size={16} strokeWidth={3} className='shrink-0' />}

      <InputPrimitive
        className='h-full grow outline-none'
        value={value}
        {...props}
      />

      {Boolean(value) && onClear && (
        <Button
          type='button'
          onClick={onClear}
          size='icon'
          className='mr-2 size-6 shrink-0'
          aria-label='Clear search'
        >
          <XIcon size={12} strokeWidth={3} />
        </Button>
      )}
    </div>
  )
}
