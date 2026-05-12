<script lang="ts">
  import { page } from "$app/state";
  import { resolvePlaylist } from "$lib/api/playlist";
  import { getTracksByIds } from "$lib/api/track";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import { paginated_limit } from "$lib/constants";
  import { dateFormatter } from "$lib/utils";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";
  import { resource } from "runed";

  const playlistQuery = resource(
    [() => page.params.user, () => page.params.playlist],
    () =>
      resolvePlaylist({
        user: page.params.user!,
        playlist: page.params.playlist!,
      }),
  );

  const playlistTracksQuery = createInfiniteQuery(() => ({
    queryKey: ["playlist-tracks", playlistQuery.current?.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds =
        playlistQuery.current?.tracks?.map((track) => track.id) ?? [];

      const startIdx = pageParam * paginated_limit;
      const endIdx = startIdx + paginated_limit;
      const idsChunk = allIds.slice(startIdx, endIdx);

      return getTracksByIds(idsChunk);
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds =
        playlistQuery.current?.tracks?.map((track) => track.id) ?? [];
      const totalChunks = Math.ceil(allIds.length / paginated_limit);

      return allPages.length < totalChunks ? allPages.length : undefined;
    },
  }));
</script>

<svelte:head>
  <title>{playlistQuery.current?.title}</title>
  <meta
    name="description"
    content={dedent`${playlistQuery.current?.user?.username}
               ${playlistQuery.current?.track_count} tracks
               ${playlistQuery.current?.created_at}
           `}
  />

  <link rel="icon" href={playlistQuery.current?.artwork_url} />
  <meta name="og:image" content={playlistQuery.current?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView resource={playlistQuery}>
      {#snippet content(playlist)}
        {@const releaseDate = playlist.release_date
          ? dateFormatter.format(new Date(playlist.release_date))
          : undefined}

        <HeroSection
          pictureSrc={playlist.artwork_url}
          title={playlist.title}
          user={playlist.user}
          description={dedent`${playlist.track_count} tracks
            ${releaseDate ?? ""}
            ${playlist.label_name ?? ""}`.trim()}
        />
      {/snippet}
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView
      query={playlistTracksQuery}
      orderedIds={playlistQuery.current?.tracks?.map((track) => track.id)}
    />
  {/snippet}
</Main>
