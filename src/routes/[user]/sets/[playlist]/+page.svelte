<script lang="ts">
  import { page } from "$app/state";
  import { resolvePlaylist } from "$lib/api/playlist";
  import { getTracksByIds } from "$lib/api/track";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import { paginated_limit } from "$lib/constants";
  import { formatDate } from "$lib/utils";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";
  import { resource } from "runed";

  const playlistResource = resource(
    [() => page.params.user, () => page.params.playlist],
    () =>
      resolvePlaylist({
        user: page.params.user!,
        playlist: page.params.playlist!,
      }),
  );

  const playlistTracks = createInfiniteQuery(() => ({
    queryKey: ["playlist-tracks", playlistResource.current?.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds =
        playlistResource.current?.tracks?.map((track) => track.id) ?? [];

      const startIdx = pageParam * paginated_limit;
      const endIdx = startIdx + paginated_limit;
      const idsChunk = allIds.slice(startIdx, endIdx);

      return getTracksByIds(idsChunk);
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds =
        playlistResource.current?.tracks?.map((track) => track.id) ?? [];
      const totalChunks = Math.ceil(allIds.length / paginated_limit);

      return allPages.length < totalChunks ? allPages.length : undefined;
    },
  }));
</script>

<svelte:head>
  <title>{playlistResource.current?.title}</title>
  <meta
    name="description"
    content={dedent`${playlistResource.current?.user?.username}
               ${playlistResource.current?.track_count} tracks
               ${playlistResource.current?.created_at}
           `}
  />

  <link rel="icon" href={playlistResource.current?.artwork_url} />
  <meta name="og:image" content={playlistResource.current?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView resource={playlistResource}>
      {#snippet content(playlist)}
        {@const releaseDate = playlist.release_date
          ? formatDate(playlist.release_date)
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
      query={playlistTracks}
      orderedIds={playlistResource.current?.tracks?.map((track) => track.id)}
    />
  {/snippet}
</Main>
