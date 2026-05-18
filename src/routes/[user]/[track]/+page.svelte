<script lang="ts">
  import { page } from "$app/state";
  import { resolveTrack } from "$lib/api/track";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import { formatDate } from "$lib/utils";
  import dedent from "dedent";
  import { resource } from "runed";

  const trackResource = resource(
    [() => page.params.user, () => page.params.track],
    () =>
      resolveTrack({
        track: page.params.track!,
        user: page.params.user!,
      }),
  );
</script>

<svelte:head>
  <title>{trackResource.current?.title}</title>
  <meta
    name="description"
    content={dedent`${trackResource.current?.user.username}
            ${trackResource.current?.label_name}
            ${trackResource.current?.genre} - ${trackResource.current?.release_date}
        `}
  />

  <link rel="icon" href={trackResource.current?.artwork_url} />
  <meta name="og:image" content={trackResource.current?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView resource={trackResource}>
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
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <AsyncView resource={trackResource}>
      {#snippet content(track)}
        <TrackListing {track} />
      {/snippet}
    </AsyncView>
  {/snippet}
</Main>
