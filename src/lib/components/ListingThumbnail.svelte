<script module lang="ts">
</script>

<script lang="ts">
  import { cn } from "$lib/utils";
  import type { ClassValue } from "clsx";

  export interface ListingThumbnailProps {
    src?: string | null;
    alt: string;
    class?: ClassValue;
  }

  const { src, alt, ...props }: ListingThumbnailProps = $props();

  let hasFailed = $state(false);
</script>

{#if src && !hasFailed}
  <img
    {src}
    {alt}
    class={cn("aspect-square size-12 rounded", props.class)}
    onerror={() => (hasFailed = true)}
  />
{:else}
  <div class="aspect-square size-12 rounded bg-base-300-700"></div>
{/if}
