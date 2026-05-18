<script lang="ts">
  import {
    searchTracks,
    searchPlaylists,
    searchUsers,
    searchAnything,
  } from "$lib/api/search";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import SegmentedPicker from "$lib/components/ui/SegmentedPicker.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  const params = useSearchParams(
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

  const debouncedQ = new Debounced(() => params.q);

  type Listing = Track | Playlist | User;

  const searchQuery = createInfiniteQuery(() => ({
    queryKey: ["search", debouncedQ.current, params.kind],
    queryFn: async ({ pageParam }) => {
      if (!debouncedQ.current) return [] as Listing[];

      const searchFn = match(params.kind)
        .with("tracks", () => searchTracks)
        .with("playlists", () => searchPlaylists)
        .with("users", () => searchUsers)
        .with("all", () => searchAnything)
        .exhaustive();

      return searchFn({
        query: debouncedQ.current,
        offset: pageParam * paginated_limit,
        limit: paginated_limit,
      }).then((r) => r.collection);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < paginated_limit ? allPages.length : undefined,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <SearchBar value={params.q} />
  {/snippet}

  {#snippet right()}
    <SegmentedPicker
      options={["all", "tracks", "playlists", "users"]}
      bind:current={params.kind}
    />
    <InfiniteQueryView query={searchQuery} />
  {/snippet}
</Main>
