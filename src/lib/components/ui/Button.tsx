import type { LucideIcon } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { AppLink } from '$lib/router-link'
import { cn } from 'cnfn'
import { buttonVariants } from './button-variants'

export type ButtonProps = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
  & VariantProps<typeof buttonVariants> & {
    className?: string
    href?: string
    icon?: LucideIcon
    iconPosition?: 'leading' | 'trailing'
  }
>

export default function Button({
  children,
  variant,
  size,
  icon: Icon,
  iconPosition = 'leading',
  className,
  href,
  disabled,
  ref,
  type,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {
  const classes = buttonVariants({ variant, size, disabled })
  const icon = Icon
    ? (
        <Icon
          size={16}
          strokeWidth={3}
          className={cn('shrink-0', size !== 'icon' && 'opacity-67')}
        />
      )
    : null

  const content = (
    <>
      {iconPosition === 'leading' && icon}
      {children}
      {iconPosition === 'trailing' && icon}
    </>
  )

  if (href) {
    const linkProps = props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>

    return (
      <AppLink
        href={href}
        className={classes.base({ class: cn(className) })}
        {...linkProps}
      >
        {content}
      </AppLink>
    )
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      disabled={disabled}
      className={classes.base({ class: cn(className) })}
      {...props}
    >
      {content}
    </button>
  )
}
