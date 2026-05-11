<script lang="ts" generics="T extends Track | Playlist | User">
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import ErrorDisplay from "./ErrorDisplay.svelte";
  import Spinner from "./Spinner.svelte";
  import PlaylistListing from "./listings/PlaylistListing.svelte";
  import TrackListing from "./listings/TrackListing.svelte";
  import UserListing from "./listings/UserListing.svelte";
  import Button from "./ui/Button.svelte";
  import { ArrowLeftIcon, ArrowRightIcon } from "@lucide/svelte";
  import type { CreateQueryResult } from "@tanstack/svelte-query";
  import { fly } from "svelte/transition";

  let {
    query,
    page = $bindable(),
    orderedIds,
  }: {
    query: CreateQueryResult<T[]>;
    page: number;
    orderedIds?: number[];
  } = $props();

  const sortedResults = $derived.by(() => {
    if (!orderedIds) return query.data ?? [];
    if (!query.data) return [];

    return query.data.sort((a, b) => {
      const ai = orderedIds.indexOf(a.id);
      const bi = orderedIds.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  });
</script>

{#snippet pagination()}
  <div class="flex items-center justify-between">
    <Button
      icon={ArrowLeftIcon}
      size="icon"
      disabled={query.isLoading || page === 1}
      onclick={() => (page = page - 1)}
      aria-label="Previous page"
    />

    <div>
      Page {page}
    </div>

    <Button
      iconPosition="trailing"
      size="icon"
      icon={ArrowRightIcon}
      disabled={query.isLoading}
      onclick={() => (page = page + 1)}
      aria-label="Next page"
    />
  </div>
{/snippet}

{@render pagination()}

{#if query.isLoading}
  <Spinner />
{:else if query.isError}
  <ErrorDisplay error={query.error} />
{:else}
  <div in:fly={{ y: 16 }} class="flex flex-col gap-4">
    {#each sortedResults as item (item)}
      {#if item.kind === "track"}
        <TrackListing track={item as Track} />
      {:else if item.kind === "playlist"}
        <PlaylistListing playlist={item as Playlist} />
      {:else if item.kind === "user"}
        <UserListing user={item as User} />
      {/if}
    {:else}
      <span class="mt-4 text-lg text-accent/25">Nothing here... </span>
    {/each}
  </div>

  {@render pagination()}
{/if}
