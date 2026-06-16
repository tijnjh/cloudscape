import type { LucideIcon } from 'lucide-react'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { cn } from 'cnfn'
import { XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Button from './Button'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string
  icon?: LucideIcon
  onValueChange?: (value: string) => void
}

export default function Input({
  value = '',
  className,
  icon: Icon,
  onChange,
  onValueChange,
  ...props
}: InputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    onValueChange?.(event.currentTarget.value)
  }

  return (
    <div
      className={cn(
        'relative flex h-10 items-center gap-2 overflow-clip rounded-full bg-base-300-700 pl-4 ring-blue-500 focus-within:ring-2',
        className,
      )}
    >
      {Icon && <Icon size={16} strokeWidth={3} className="shrink-0" />}

      <input
        {...props}
        value={value}
        onChange={handleChange}
        className="h-full grow outline-none"
      />

      <AnimatePresence>
        {value
          ? (
              <motion.div
                initial={{ scale: 0.75 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  type="button"
                  onClick={() => onValueChange?.('')}
                  size="icon"
                  className="mr-2 size-6 shrink-0"
                >
                  <XIcon size={12} strokeWidth={3} />
                </Button>
              </motion.div>
            )
          : null}
      </AnimatePresence>
    </div>
  )
}
