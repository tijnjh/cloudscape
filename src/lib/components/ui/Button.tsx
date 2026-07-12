import type { LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button as BaseButton } from '@base-ui/react/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cnfn'
import { tv } from 'tailwind-variants'

export const buttonVariants = tv({
  slots: {
    base: [
      'flex cursor-pointer items-center justify-center gap-2 truncate rounded-full transition-transform duration-150 ease-out',
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
      false: 'hover:opacity-80 active:scale-97 active:opacity-50',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'primary',
  },
})

export type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'>
  & VariantProps<typeof buttonVariants> & {
    children?: ReactNode
    className?: string
    href?: string
    icon?: LucideIcon
    iconPosition?: 'leading' | 'trailing'
  }

export default function Button({
  children,
  variant,
  size,
  icon: Icon,
  iconPosition = 'leading',
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = buttonVariants({ variant, size, disabled: props.disabled })

  const icon = Icon
    ? (
        <Icon
          size={16}
          strokeWidth={3}
          className={cn('shrink-0', size !== 'icon' && 'opacity-67')}
        />
      )
    : null

  const render = href
    ? href.startsWith('/')
      ? <Link to={href} />
      : <a href={href} />
    : undefined

  return (
    <BaseButton
      render={render}
      nativeButton={!render}
      className={classes.base({ class: cn(className) })}
      {...props}
    >
      {iconPosition === 'leading' && icon}

      {children}

      {iconPosition === 'trailing' && icon}
    </BaseButton>
  )
}
