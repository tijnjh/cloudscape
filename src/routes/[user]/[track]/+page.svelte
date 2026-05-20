<script lang="ts">
  import { getTrackComments, resolveTrack } from "$lib/api/track";
  import Comment from "$lib/components/Comment.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants.js";
  import { formatDate } from "$lib/utils";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const { params } = $props();

  const trackQuery = createQuery(() => ({
    queryKey: ["track", params.user, params.track],
    queryFn: () => resolveTrack(params),
  }));

  const trackCommentsQuery = createInfiniteQuery(() => ({
    queryKey: ["trackComments", params.user, params.track],
    queryFn: async ({ pageParam }) => {
      return await getTrackComments({
        id: trackQuery.data!.id,
        offset: pageParam,
        limit: paginated_limit,
      }).then((res) => res.collection);
    },
    enabled: trackQuery.isSuccess,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < paginated_limit) {
        return undefined;
      }
      return allPages.length * paginated_limit;
    },
    initialPageParam: 0,
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

    <h2 class="mt-8 text-2xl font-medium">Comments</h2>

    <InfiniteQueryView query={trackCommentsQuery} />

    <!-- <QueryView query={trackCommentsQuery}>
      {#snippet content(data)}
        <h2 class="mt-8 text-2xl font-medium">Comments</h2>
        <div class="flex flex-col gap-4">
          {#each data.collection as comment (comment.id)}
            <Comment {comment} />
          {/each}
        </div>
        <Button href={data.next_href}>{new URL(data.next_href).search}</Button>
      {/snippet}
    </QueryView> -->
  {/snippet}
</Main>
