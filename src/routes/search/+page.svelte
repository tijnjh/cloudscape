<script lang="ts">
  import {
    searchAnything,
    searchPlaylists,
    searchTracks,
    searchUsers,
  } from "$lib/api/search";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import SegmentedPicker from "$lib/components/ui/SegmentedPicker.svelte";
  import { max_items_per_page } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  const searchParams = useSearchParams(
    v.object({
      q: v.optional(v.string(), ""),
      kind: v.optional(
        v.picklist(["all", "tracks", "playlists", "users"]),
        "all",
      ),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => searchParams.q);

  type Listing = Track | Playlist | User;

  const searchQuery = createInfiniteQuery(() => ({
    queryKey: ["search", debouncedQ.current, searchParams.kind],
    queryFn: async ({ pageParam }) => {
      if (!debouncedQ.current) return [] as Listing[];

      const searchFn = match(searchParams.kind)
        .with("tracks", () => searchTracks)
        .with("playlists", () => searchPlaylists)
        .with("users", () => searchUsers)
        .with("all", () => searchAnything)
        .exhaustive();

      return searchFn({
        query: debouncedQ.current,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      }).then((r) => r.collection);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < max_items_per_page ? allPages.length : undefined,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <SearchBar value={searchParams.q} />
  {/snippet}

  {#snippet right()}
    <SegmentedPicker
      options={["all", "tracks", "playlists", "users"]}
      bind:current={searchParams.kind}
    />
    <InfiniteQueryView query={searchQuery} />
  {/snippet}
</Main>
