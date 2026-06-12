<script lang="ts">
  import { resolveTrack } from "$lib/api/track";
  import CommentsView from "$lib/components/CommentsView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import { formatDate } from "$lib/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const { params } = $props();

  const trackQuery = createQuery(() => ({
    queryKey: ["track", params.user, params.track],
    queryFn: () => resolveTrack(params),
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
        {const releaseDate = formatDate(track.release_date)}

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

        {#if track.commentable}
          <h2 class="mt-4 text-lg font-medium">
            Comments{track.comment_count != null
              ? ` (${track.comment_count})`
              : ""}
          </h2>
          <CommentsView trackId={track.id} />
        {/if}
      {/snippet}
    </QueryView>
  {/snippet}
</Main>
