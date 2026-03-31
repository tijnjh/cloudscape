<script lang="ts">
  import { page } from "$app/state";
  import { resolveTrack } from "$lib/api/track.remote";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import AsyncResultQueryView from "../../../AsyncResultQueryView.svelte";
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

  const track = $derived(
    trackQuery.data?.match({
      ok: (v) => v,
      err: () => null,
    }),
  );
</script>

<svelte:head>
  <title>{track?.title}</title>
  <meta
    name="description"
    content={dedent`${track?.user.username}
            ${track?.label_name}
            ${track?.genre} - ${track?.release_date}
        `}
  />

  <link rel="icon" href={track?.artwork_url} />
  <meta name="og:image" content={track?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncResultQueryView query={trackQuery}>
      {#snippet content(data)}
        <HeroSection
          pictureSrc={data.artwork_url}
          title={data.title}
          user={data.user}
        />
      {/snippet}
    </AsyncResultQueryView>
  {/snippet}

  {#snippet right()}
    <AsyncResultQueryView query={trackQuery}>
      {#snippet content(data)}
        <TrackListing track={data} />
      {/snippet}
    </AsyncResultQueryView>
  {/snippet}
</Main>
