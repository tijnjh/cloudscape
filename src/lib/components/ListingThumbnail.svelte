<script module lang='ts'>
  import type { ClassValue } from 'cnfn'

  export interface ListingThumbnailProps {
    src?: string | null
    alt: string
    class?: ClassValue
  }
</script>

<script lang='ts'>
  import { cn } from 'cnfn'

  const { src, alt, ...props }: ListingThumbnailProps = $props()

  let hasFailed = $state(false)
</script>

{#if src && !hasFailed}
  <img
    {src}
    {alt}
    width='48'
    height='48'
    class={cn('aspect-square size-12 rounded-sm', props.class)}
    onerror={() => (hasFailed = true)}
  />
{:else}
  <div class='aspect-square size-12 rounded-sm bg-base-300-700'></div>
{/if}
