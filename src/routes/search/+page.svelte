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
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { createQuery } from "@tanstack/svelte-query";
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
      page: v.optional(v.number(), 1),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => searchParams.q);

  type Listing = Track | Playlist | User;

  const searchQuery = createQuery<Listing[]>(() => ({
    queryKey: [
      "search",
      debouncedQ.current,
      searchParams.kind,
      searchParams.page,
    ],
    queryFn: async () => {
      if (!debouncedQ.current) return [];

      const searchFn = match(searchParams.kind)
        .with("tracks", () => searchTracks)
        .with("playlists", () => searchPlaylists)
        .with("users", () => searchUsers)
        .with("all", () => searchAnything)
        .exhaustive();

      return searchFn({
        query: debouncedQ.current,
        offset: (searchParams.page - 1) * paginated_limit,
        limit: paginated_limit,
      }).then((r) => r.collection);
    },
    initialPageParam: 0,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <SearchBar value={searchParams.q} />

    <div class="mx-auto flex w-full max-w-xl gap-2">
      {#each ["all", "tracks", "playlists", "users"] as const as kind (kind)}
        {#key searchParams.kind}
          <Button
            variant={searchParams.kind === kind ? "primary" : "secondary"}
            class="capitalize"
            onclick={() => {
              searchParams.kind = kind;
              searchQuery.refetch();
            }}
          >
            {kind}
          </Button>
        {/key}
      {/each}
    </div>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView bind:page={searchParams.page} query={searchQuery} />
  {/snippet}
</Main>
