<script lang="ts">
  import { getSelections } from "$lib/api/discovery";
  import { getTracksByIds } from "$lib/api/track";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const selectionsQuery = createQuery(() => ({
    queryKey: ["selections"],
    queryFn: () => getSelections(),
  }));

  const favoritesQuery = createQuery(() => ({
    queryKey: ["favorites", favoriteTrackIds],
    queryFn: () => getTracksByIds(favoriteTrackIds.current),
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

      <SearchBar />
    </div>

    {#if favoriteTrackIds.current.length > 0}
      <h2
        title="These are saved in localstorage"
        class="mt-8 text-2xl font-medium"
      >
        Your Favorites
      </h2>

      <QueryView query={favoritesQuery}>
        {#snippet content(favorites)}
          {#each favorites as favorite (favorite.id)}
            <TrackListing track={favorite} />
          {/each}
        {/snippet}
      </QueryView>
    {/if}
  {/snippet}
  {#snippet right()}
    <QueryView query={selectionsQuery}>
      {#snippet content(data)}
        {#each data.collection as selection (selection.items)}
          <h3 class="text-2xl font-medium">
            {selection.title}
          </h3>
          {#each selection.items.collection as item, i (item.id + selection.id + i)}
            {#if item.kind === "playlist"}
              <PlaylistListing playlist={item} />
            {:else if item.kind === "user"}
              <UserListing user={item} />
            {/if}
          {/each}
          <br />
        {:else}
          <span class="mt-4 text-lg text-mist-900-100/25">Nothing here...</span>
        {/each}
      {/snippet}
    </QueryView>
  {/snippet}
</Main>
