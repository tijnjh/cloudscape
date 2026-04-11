<script lang="ts">
  import {
    searchTracks,
    searchPlaylists,
    searchUsers,
    searchAnything,
  } from "$lib/api/search";
  import Main from "$lib/components/Main.svelte";
  import ResourceView from "$lib/components/ResourceView.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { Debounced, resource } from "runed";
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

  const searchQuery = resource([() => debouncedQ.current], async () => {
    if (!debouncedQ.current) return [] as Listing[];

    const searchFn = match(params.kind)
      .with("tracks", () => searchTracks)
      .with("playlists", () => searchPlaylists)
      .with("users", () => searchUsers)
      .with("all", () => searchAnything)
      .exhaustive();

    return searchFn({
      query: debouncedQ.current,
      limit: paginated_limit,
    }).then((r) => r.collection);
  });
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
    <ResourceView resource={searchQuery}>
      {#snippet content(data)}
        {#each data as result (result.id)}
          {#if result.kind === "track"}
            <TrackListing track={result as Track} />
          {:else if result.kind === "playlist"}
            <PlaylistListing playlist={result as Playlist} />
          {:else if result.kind === "user"}
            <UserListing user={result as User} />
          {/if}
        {/each}
      {/snippet}
    </ResourceView>
  {/snippet}
</Main>
