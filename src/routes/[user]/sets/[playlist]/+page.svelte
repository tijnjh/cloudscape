<script lang="ts">
  import { page } from "$app/state";
  import { resolvePlaylist } from "$lib/api/playlist";
  import { getTracksByIds } from "$lib/api/track";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import { paginated_limit } from "$lib/constants";
  import { dateFormatter } from "$lib/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";
  import { useSearchParams } from "runed/kit";
  import * as v from "valibot";

  const searchParams = useSearchParams(
    v.object({
      page: v.optional(v.number(), 1),
    }),
  );

  const playlistQuery = createQuery(() => ({
    queryKey: ["playlist", page.params.user, page.params.playlist],
    queryFn: () =>
      resolvePlaylist({
        user: page.params.user!,
        playlist: page.params.playlist!,
      }),
  }));

  const playlistTracksQuery = createQuery(() => ({
    queryKey: [
      "playlist-tracks",
      searchParams.page,
      page.params.user,
      page.params.playlist,
    ],
    queryFn: () => {
      const start = (searchParams.page - 1) * paginated_limit;
      const end = start + paginated_limit;

      const ids =
        playlistQuery.data?.tracks?.slice(start, end).map(({ id }) => id) ?? [];

      return getTracksByIds(ids);
    },
  }));

  const canAdvance = $derived.by(() => {
    if (!playlistQuery.data) return false;
    return (
      (playlistQuery.data.track_count || 0) >
      searchParams.page * paginated_limit
    );
  });
</script>

<svelte:head>
  <title>{playlistQuery.data?.title}</title>
  <meta
    name="description"
    content={dedent`${playlistQuery.data?.user?.username}
               ${playlistQuery.data?.track_count} tracks
               ${playlistQuery.data?.created_at}
           `}
  />

  <link rel="icon" href={playlistQuery.data?.artwork_url} />
  <meta name="og:image" content={playlistQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <QueryView query={playlistQuery}>
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
    </QueryView>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView
      query={playlistTracksQuery}
      bind:page={searchParams.page}
    />
  {/snippet}
</Main>
