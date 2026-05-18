<script lang="ts" generics="T">
  import Spinner from "$lib/components/Spinner.svelte";
  import ErrorDisplay from "./ErrorDisplay.svelte";
  import type { CreateQueryResult } from "@tanstack/svelte-query";
  import { cn, type ClassValue } from "cnfn";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  const {
    query,
    content,
    class: className,
    isLoading = (q) => q.isLoading,
  }: {
    query: CreateQueryResult<T>;
    content: Snippet<[data: T]>;
    class?: ClassValue;
    isLoading?: (query: CreateQueryResult<T>) => boolean;
  } = $props();
</script>

{#if isLoading(query)}
  <Spinner />
{:else if query.isError}
  <ErrorDisplay error={query.error} />
{:else if query.data}
  <div in:fly={{ y: 16 }} class={cn("flex flex-col gap-4", className)}>
    {@render content(query.data)}
  </div>
{/if}
