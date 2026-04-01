<script lang="ts">
  import { page } from "$app/state";
  import { getPermalinkPath, scApi } from "$lib/api/utils";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import { PAGINATION_LIMIT } from "$lib/constants";
  import { Playlist } from "$lib/schemas/playlist";
  import { Track } from "$lib/schemas/track";
  import AsyncResultQueryView from "../../../../lib/components/AsyncResultQueryView.svelte";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";
  import * as v from "valibot";

  const playlistQuery = createQuery(() => ({
    queryKey: ["playlist", page.params.user, page.params.playlist],
    queryFn: () =>
      scApi(
        getPermalinkPath(page.params.user!, "sets", page.params.playlist!),
        {
          schema: Playlist,
        },
      ),
  }));

  const playlist = $derived(
    playlistQuery.data?.match({
      ok: (v) => v,
      err: () => null,
    }),
  );

  const playlistTracksQuery = createInfiniteQuery(() => ({
    queryKey: ["playlist-tracks", playlist?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const allIds = playlist?.tracks?.map((track) => track.id) ?? [];

      const startIdx = pageParam * PAGINATION_LIMIT;
      const endIdx = startIdx + PAGINATION_LIMIT;
      const idsChunk = allIds.slice(startIdx, endIdx);

      if (!idsChunk.length) {
        return [];
      }

      return await scApi("/tracks", {
        params: {
          ids: idsChunk.join(","),
          limit: PAGINATION_LIMIT,
        },
        schema: v.array(Track),
      }).then((res) => res.unwrap());
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlist?.tracks?.map((track) => track.id) ?? [];
      const totalChunks = Math.ceil(allIds.length / PAGINATION_LIMIT);

      return allPages.length < totalChunks ? allPages.length : undefined;
    },
  }));
</script>

<svelte:head>
  <title>{playlist?.title}</title>
  <meta
    name="description"
    content={dedent`${playlist?.user.username}
               ${playlist?.track_count} tracks
               ${playlist?.created_at}
           `}
  />

  <link rel="icon" href={playlist?.artwork_url} />
  <meta name="og:image" content={playlist?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncResultQueryView query={playlistQuery}>
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
    <InfiniteQueryView
      query={playlistTracksQuery}
      orderedIds={playlist?.tracks?.map((track) => track.id)}
    />
  {/snippet}
</Main>
