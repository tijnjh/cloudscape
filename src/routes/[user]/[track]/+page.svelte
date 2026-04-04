<script lang="ts">
  import { page } from "$app/state";
  import { resolveTrack } from "$lib/api/track";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import { dateFormatter } from "$lib/utils";
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
  <meta
    name="description"
    content={dedent`${trackQuery.data?.user.username}
            ${trackQuery.data?.label_name}
            ${trackQuery.data?.genre} - ${trackQuery.data?.release_date}
        `}
  />

  <link rel="icon" href={trackQuery.data?.artwork_url} />
  <meta name="og:image" content={trackQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <QueryView query={trackQuery}>
      {#snippet content(track)}
        {@const releaseDate = track.release_date
          ? dateFormatter.format(new Date(track.release_date))
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
