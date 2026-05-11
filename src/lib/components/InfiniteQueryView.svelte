<script lang="ts" generics="T extends Track | Playlist | User">
  import { paginated_limit } from "$lib/constants";
  import type { Collection } from "$lib/schemas/collection";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import ErrorDisplay from "./ErrorDisplay.svelte";
  import Spinner from "./Spinner.svelte";
  import PlaylistListing from "./listings/PlaylistListing.svelte";
  import TrackListing from "./listings/TrackListing.svelte";
  import UserListing from "./listings/UserListing.svelte";
  import Button from "./ui/Button.svelte";
  import type { CreateQueryResult } from "@tanstack/svelte-query";
  import { useSearchParams } from "runed/kit";
  import { fly } from "svelte/transition";
  import * as v from "valibot";

  const params = useSearchParams(
    v.object({
      page: v.optional(v.number(), 1),
    }),
  );

  let {
    query,
    orderedIds,
  }: {
    query: CreateQueryResult<Collection<T>>;
    orderedIds?: number[];
  } = $props();

  // const sortedPages = $derived.by(() => {
  //   if (!orderedIds) {
  //     return query.data?.collection ?? [];
  //   }

  //   return query.data?.collection.map((page) => {
  //     if (orderedIds.length === 0) return page;

  //     return page.sort((a, b) => {
  //       const ai = orderedIds.indexOf(a.id);
  //       const bi = orderedIds.indexOf(b.id);
  //       if (ai === -1 && bi === -1) return 0;
  //       if (ai === -1) return 1;
  //       if (bi === -1) return -1;
  //       return ai - bi;
  //     });
  //   });
  // });
</script>

{#snippet pagination()}
  {@const totalPages = Math.ceil(
    (query.data?.total_results ?? 0) / paginated_limit,
  )}
  <div class="flex items-center justify-between">
    <Button onclick={() => (params.page = params.page - 1)}>Previous</Button>

    <div>
      Page {params.page} of {totalPages}
    </div>

    <Button onclick={() => (params.page = params.page + 1)}>Next</Button>
  </div>
{/snippet}

{@render pagination()}

{#if query.isLoading}
  <Spinner />
{:else if query.isError}
  <ErrorDisplay error={query.error} />
{:else}
  <div in:fly={{ y: 16 }} class="flex flex-col gap-4">
    {#each query.data?.collection as item (item)}
      {#if item.kind === "track"}
        <TrackListing track={item as Track} />
      {:else if item.kind === "playlist"}
        <PlaylistListing playlist={item as Playlist} />
      {:else if item.kind === "user"}
        <UserListing user={item as User} />
      {/if}
    {:else}
      {#if !query.isLoading}
        <span class="mt-4 text-lg text-base-100-900/25">Nothing here...</span>
      {/if}
    {/each}
  </div>
  {@render pagination()}
{/if}

<!-- 
{#if query.hasNextPage}
  <Button
    class="mt-8 w-full"
    onclick={() => {
      query.fetchNextPage();
    }}
    {@attach whenInView(() => {
      if (query.isFetching) return;
      query.fetchNextPage();
    })}
  >
    Load more
  </Button>
{/if} -->
