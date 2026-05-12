<script lang="ts" generics="T">
  import Spinner from "$lib/components/Spinner.svelte";
  import ErrorDisplay from "./ErrorDisplay.svelte";
  import { cn, type ClassValue } from "cnfn";
  import type { ResourceReturn } from "runed";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  const {
    resource,
    content,
    class: className,
  }: {
    resource: ResourceReturn<T>;
    content: Snippet<[data: T]>;
    class?: ClassValue;
  } = $props();
</script>

{#if resource.loading}
  <Spinner />
{:else if resource.error}
  <ErrorDisplay error={resource.error} />
{:else if resource.current}
  <div in:fly={{ y: 16 }} class={cn("flex flex-col gap-4", className)}>
    {@render content(resource.current)}
  </div>
{/if}
