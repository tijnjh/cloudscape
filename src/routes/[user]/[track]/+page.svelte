<script lang="ts">
  import { page } from "$app/state";
  import { resolveTrack } from "$lib/api/track";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import { formatDate } from "$lib/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const trackQuery = createQuery(() => ({
    queryKey: ["track", page.params.track],
    queryFn: () =>
      resolveTrack({
        track: page.params.track!,
        user: page.params.user!,
      }),
  }));
</script>

<svelte:head>
  <title>{trackQuery.data?.title}</title>
  <link rel="icon" href={trackQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <QueryView query={trackQuery}>
      {#snippet content(track)}
        {@const releaseDate = track.release_date
          ? formatDate(track.release_date)
          : undefined}

        <HeroSection
          pictureSrc={track.artwork_url}
          title={track.title}
          user={track.user}
          description={dedent`${track.genre}
            ${releaseDate ?? ""}
            ${track.label_name}`.trim()}
        />
      {/snippet}
    </QueryView>
  {/snippet}

  {#snippet right()}
    <QueryView query={trackQuery}>
      {#snippet content(track)}
        <TrackListing {track} />
      {/snippet}
    </QueryView>
  {/snippet}
</Main>
