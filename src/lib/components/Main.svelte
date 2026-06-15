<script lang='ts'>
  import type { ClassValue } from 'cnfn'
  import type { Snippet } from 'svelte'
  import { cn } from 'cnfn'

  const {
    children,
    left,
    right,
    split = [50, 50],
    class: className,
  }: {
    children?: Snippet
    left?: Snippet
    right?: Snippet
    split?: [number, number]
    class?: ClassValue
  } = $props()

  const [leftSplit, rightSplit] = $derived(split)

  function accountForGap(percent: number) {
    return `calc(${percent}% - .5rem)`
  }

  const gridTemplateColumns = $derived.by(
    () => `${accountForGap(leftSplit)} ${accountForGap(rightSplit)}`,
  )
</script>

<main
  class={cn(
    'mx-auto mt-16 flex max-w-5xl flex-col md:grid md:gap-4',
    className,
  )}
  style='grid-template-columns: {gridTemplateColumns}'
>
  {#if left}
    <div class='top-16 flex h-fit flex-col gap-4 p-4 md:sticky'>
      {@render left()}
    </div>
  {/if}

  {#if right}
    <div class='mb-64 flex flex-col gap-4 p-4'>
      {@render right()}
    </div>
  {/if}

  {#if !left && !right && children}
    <div class='mb-64 flex flex-col gap-4 p-4'>
      {@render children()}
    </div>
  {/if}
</main>
