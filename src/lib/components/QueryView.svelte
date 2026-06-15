<script lang='ts' generics="T">
  import type { CreateQueryResult } from '@tanstack/svelte-query'
  import type { ClassValue } from 'cnfn'
  import type { Snippet } from 'svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { cn } from 'cnfn'
  import { fly } from 'svelte/transition'
  import ErrorDisplay from './ErrorDisplay.svelte'

  const {
    query,
    content,
    class: className,
  }: {
    query: CreateQueryResult<T>
    content: Snippet<[data: T]>
    class?: ClassValue
  } = $props()
</script>

{#if query.isLoading}
  <Spinner />
{:else if query.isError}
  <ErrorDisplay error={query.error} />
{:else if query.data}
  <div in:fly={{ y: 16 }} class={cn('flex flex-col gap-4', className)}>
    {@render content(query.data)}
  </div>
{/if}
