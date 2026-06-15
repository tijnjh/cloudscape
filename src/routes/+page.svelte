<script lang="ts">
  import { getSelections } from "$lib/api/discovery";
  import { getTracksByIds } from "$lib/api/track";
  import Main from "$lib/components/Main.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import { Settings2Icon } from "@lucide/svelte";

  const selections = await getSelections();
  const favorites = await getTracksByIds(favoriteTrackIds.current);
</script>

<svelte:head>
  <title>Cloudscape</title>
</svelte:head>

<Main class="mt-16">
  {#snippet left()}
    <div class="flex w-full flex-col items-start gap-4">
      <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-medium">Cloudscape</h1>
        <div class="flex items-center gap-2">
          <Button variant="secondary" href="https://tijn.dev/cloudscape">
            Source
          </Button>
          <Button size="icon" icon={Settings2Icon} href="/_/preferences" />
        </div>
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

      {#each favorites as favorite (favorite.id)}
        <TrackListing track={favorite} />
      {/each}
    {/if}
  {/snippet}
  {#snippet right()}
    {#each selections.collection as selection (selection.items)}
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
      <span class="mt-4 text-lg text-base-900-100/25">Nothing here...</span>
    {/each}
  {/snippet}
</Main>
