<script lang='ts' generics="T extends string[]">
  import type { ClassValue } from 'cnfn'
  import { cn } from 'cnfn'
  import Button from './Button.svelte'

  let {
    options,
    current = $bindable(),
    onchange,
    class: className,
  }: {
    options: T
    current?: T[number]
    onchange?: (value: T[number]) => void
    class?: ClassValue
  } = $props()
</script>

<div class={cn('flex gap-2', className)}>
  {#each options as option (option)}
    {#key current}
      <Button
        variant={current === option ? 'primary' : 'secondary'}
        onclick={() => {
          current = option
          onchange?.(option)
        }}
      >
        {option}
      </Button>
    {/key}
  {/each}
</div>
