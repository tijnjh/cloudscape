import { tv } from 'tailwind-variants'

export const buttonVariants = tv({
  slots: {
    base: [
      'flex cursor-pointer items-center justify-center gap-2 truncate rounded-full transition-transform',
    ],
  },
  variants: {
    variant: {
      primary: 'bg-accent text-base-200-800',
      secondary: 'bg-base-300-700',
    },
    size: {
      default: 'px-4 py-2',
      icon: 'size-10',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: 'hover:opacity-80 active:scale-90 active:opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'primary',
  },
})
