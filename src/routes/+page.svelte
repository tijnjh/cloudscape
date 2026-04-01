<script lang="ts">
  import { scApi } from "$lib/api/utils";
  import Main from "$lib/components/Main.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { PAGINATION_LIMIT } from "$lib/constants";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import { Collection } from "$lib/schemas/collection";
  import { Playlist } from "$lib/schemas/playlist";
  import { Selection } from "$lib/schemas/selection";
  import { Track } from "$lib/schemas/track";
  import { User } from "$lib/schemas/user";
  import AsyncResultQueryView from "../lib/components/AsyncResultQueryView.svelte";
  import { SearchIcon } from "@lucide/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Result } from "better-result";
  import * as v from "valibot";

  const selectionsQuery = createQuery(() => ({
    queryKey: ["selections"],
    queryFn: () =>
      scApi("/mixed-selections", {
        schema: Collection(Selection(v.union([Playlist, User]))),
      }),
  }));

  const favoritesQuery = createQuery(() => ({
    queryKey: ["favorites", favoriteTrackIds],
    queryFn: async () => {
      if (!favoriteTrackIds.current.length) {
        return Result.ok([]);
      }

      return await scApi("/tracks", {
        params: {
          ids: favoriteTrackIds.current.join(","),
          limit: PAGINATION_LIMIT,
        },
        schema: v.array(Track),
      });
    },
  }));
</script>

<svelte:head>
  <title>Cloudscape</title>
</svelte:head>

<Main class="mt-16">
  {#snippet left()}
    <div class="flex w-full flex-col items-start gap-4">
      <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-medium">Cloudscape</h1>
        <Button variant="secondary" href="https://tijn.dev/cloudscape">
          View on GitHub
        </Button>
      </div>

      <form action="search" class="w-full">
        <Input
          type="text"
          name="q"
          placeholder="Search for artists, tracks or playlists..."
          class="w-full"
          icon={SearchIcon}
        />
      </form>
    </div>

    {#if favoriteTrackIds.current.length > 0}
      <h2
        title="These are saved in localstorage"
        class="mt-8 text-2xl font-medium"
      >
        Your Favorites
      </h2>

      <AsyncResultQueryView query={favoritesQuery}>
        {#snippet content(data)}
          {#each data as favorite (favorite.id)}
            <TrackListing track={favorite} />
          {/each}
        {/snippet}
      </AsyncResultQueryView>
    {/if}
  {/snippet}
  {#snippet right()}
    <AsyncResultQueryView query={selectionsQuery}>
      {#snippet content(data)}
        {#each data.collection as selection (selection.id)}
          <h3 class="text-2xl font-medium">
            {selection.title}
          </h3>
          {#each selection.items.collection as item (item.id)}
            {#if item.kind === "playlist"}
              <PlaylistListing playlist={item} />
            {:else if item.kind === "user"}
              <UserListing user={item} />
            {/if}
          {/each}
          <br />
        {:else}
          <span class="mt-4 text-mist-900-100/25 text-lg">Nothing here...</span>
        {/each}
      {/snippet}
    </AsyncResultQueryView>
  {/snippet}
</Main>
