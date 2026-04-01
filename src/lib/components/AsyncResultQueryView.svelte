<script lang="ts" generics="T, E">
  import Spinner from "$lib/components/Spinner.svelte";
  import type { CreateQueryResult } from "@tanstack/svelte-query";
  import type { Result } from "better-result";
  import { cn, type ClassValue } from "cnfn";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  const {
    query,
    content,
    class: className,
  }: {
    query: CreateQueryResult<Result<T, E>>;
    content: Snippet<[data: T]>;
    class?: ClassValue;
  } = $props();
</script>

{#if query.isLoading}
  <Spinner />
{:else if query.data?.isErr()}
  <div>{query.data.error}</div>
{:else if query.data?.isOk()}
  <div in:fly={{ y: 16 }} class={cn("flex flex-col gap-4", className)}>
    {@render content(query.data.value!)}
  </div>
{/if}
