<script module lang='ts'>
  import type { LucideIcon } from '@lucide/svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { XIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import { scale } from 'svelte/transition'
  import Button from './Button.svelte'

  export interface InputProps extends HTMLInputAttributes {
    icon?: LucideIcon
  }
</script>

<script lang='ts'>
  let {
    value = $bindable(),
    class: className,
    icon: Icon,
    ...props
  }: InputProps = $props()
</script>

<div
  class={cn(
    'relative flex h-11 items-center gap-2 overflow-clip rounded-full border border-base-400-600/15 bg-base-50-950/45 pl-4 shadow-sm shadow-base-950/5 ring-accent transition-[box-shadow,background-color] duration-200 focus-within:bg-base-50-950/70 focus-within:ring-2 dark:bg-base-300-700/75',
    className,
  )}
>
  {#if Icon}
    <Icon size={16} strokeWidth={2.5} class='shrink-0 opacity-55' />
  {/if}

  <input {...props} bind:value class='h-full grow bg-transparent outline-none placeholder:opacity-45' />

  {#if value}
    <div transition:scale={{ start: 0.75, duration: 150 }}>
      <Button
        type='button'
        onclick={() => (value = '')}
        size='icon'
        class='mr-2 size-6 shrink-0'
      >
        <XIcon size={12} strokeWidth={3} />
      </Button>
    </div>
  {/if}
</div>
