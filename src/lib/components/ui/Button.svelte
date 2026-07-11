<script module lang='ts'>
  import type { LucideIcon } from '@lucide/svelte'
  import type { ButtonRootProps } from 'bits-ui'
  import type { VariantProps } from 'tailwind-variants'
  import { tv } from 'tailwind-variants'

  export const buttonVariants = tv({
    slots: {
      base: [
        'flex cursor-pointer items-center justify-center gap-2 truncate rounded-full border border-transparent font-medium tracking-[-0.01em] transition-[transform,opacity,background-color,box-shadow] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base-200-800',
      ],
    },
    variants: {
      variant: {
        primary: 'bg-accent text-base-200-800 shadow-sm shadow-base-950/10 dark:shadow-black/25',
        secondary: 'border-base-400-600/15 bg-base-50-950/45 shadow-sm shadow-base-950/5 dark:bg-base-300-700/75 dark:shadow-black/20',
      },
      size: {
        default: 'px-4 py-2',
        icon: 'size-10',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'hover:opacity-85 active:scale-97 active:opacity-65',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'primary',
    },
  })

  export type ButtonProps = ButtonRootProps
    & VariantProps<typeof buttonVariants> & {
      icon?: LucideIcon
      iconPosition?: 'leading' | 'trailing'
    }
</script>

<script lang='ts'>
  import { Button } from 'bits-ui'
  import { cn } from 'cnfn'

  const {
    children,
    variant,
    size,
    icon: Icon,
    iconPosition = 'leading',
    class: className,
    ...props
  }: ButtonProps = $props()

  const classes = $derived(
    buttonVariants({ variant, size, disabled: props.disabled }),
  )
</script>

{#snippet iconSnippet()}
  <Icon
    size={16}
    strokeWidth={3}
    class={['shrink-0', size !== 'icon' && 'opacity-67']}
  />
{/snippet}

<Button.Root class={classes.base({ class: cn(className) })} {...props}>
  {#if iconPosition === 'leading'}
    {@render iconSnippet()}
  {/if}

  {@render children?.()}

  {#if iconPosition === 'trailing'}
    {@render iconSnippet()}
  {/if}
</Button.Root>
