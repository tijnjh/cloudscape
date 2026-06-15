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
    'relative flex h-10 items-center gap-2 overflow-clip rounded-full bg-base-300-700 pl-4 ring-blue-500 focus-within:ring-2',
    className,
  )}
>
  {#if Icon}
    <Icon size={16} strokeWidth={3} class='shrink-0' />
  {/if}

  <input {...props} bind:value class='h-full grow outline-none' />

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
