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
  import { Collection } from "$lib/schemas/collection";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { createQuery } from "@tanstack/svelte-query";
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
      page: v.optional(v.number(), 1),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => params.q);

  type Listing = Track | Playlist | User;

  const searchQuery = createQuery<Collection<Listing>>(() => ({
    queryKey: ["search", debouncedQ.current, params.kind, params.page],
    queryFn: async () => {
      if (!debouncedQ.current) return { collection: [] };

      const searchFn = match(params.kind)
        .with("tracks", () => searchTracks)
        .with("playlists", () => searchPlaylists)
        .with("users", () => searchUsers)
        .with("all", () => searchAnything)
        .exhaustive();

      return searchFn({
        query: debouncedQ.current,
        offset: params.page * paginated_limit,
        limit: paginated_limit,
      });
    },
    initialPageParam: 0,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <SearchBar value={params.q} />

    <div class="mx-auto flex w-full max-w-xl gap-2">
      {#each ["all", "tracks", "playlists", "users"] as const as kind (kind)}
        {#key params.kind}
          <Button
            variant={params.kind === kind ? "primary" : "secondary"}
            class="capitalize"
            onclick={() => {
              params.kind = kind;
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
    <InfiniteQueryView query={searchQuery} />
  {/snippet}
</Main>
