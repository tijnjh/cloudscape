import type { InputProps as InputPrimitiveProps } from '@base-ui/react/input'
import type { LucideIcon } from 'lucide-react'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from 'cnfn'

export interface InputProps extends InputPrimitiveProps {
  icon?: LucideIcon
}

export default function Input({ className, icon: Icon, ...props }: InputProps) {
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
        {...props}
      />
    </div>
  )
}
