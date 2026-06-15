<script lang='ts'>
  import { resolvePlaylist } from '$lib/api/playlist'
  import { getTracksByIds } from '$lib/api/track'
  import HeroSection from '$lib/components/HeroSection.svelte'
  import InfiniteQueryView from '$lib/components/InfiniteQueryView.svelte'
  import Main from '$lib/components/Main.svelte'
  import QueryView from '$lib/components/QueryView.svelte'
  import { max_items_per_page } from '$lib/constants'
  import { formatDate } from '$lib/utils'
  import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query'
  import dedent from 'dedent'

  const { params } = $props()

  const playlistQuery = createQuery(() => ({
    queryKey: ['playlist', params.user, params.playlist],
    queryFn: () => resolvePlaylist(params),
  }))

  const playlistTracksQuery = createInfiniteQuery(() => ({
    queryKey: ['playlist-tracks', playlistQuery.data?.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds = playlistQuery.data?.tracks?.map(track => track.id) ?? []

      const startIdx = pageParam * max_items_per_page
      const endIdx = startIdx + max_items_per_page
      const idsChunk = allIds.slice(startIdx, endIdx)

      return getTracksByIds(idsChunk)
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlistQuery.data?.tracks?.map(track => track.id) ?? []
      const totalChunks = Math.ceil(allIds.length / max_items_per_page)

      return allPages.length < totalChunks ? allPages.length : undefined
    },
  }))
</script>

<svelte:head>
  <title>{playlistQuery.data?.title}</title>
  <link rel='icon' href={playlistQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <QueryView query={playlistQuery}>
      {#snippet content(playlist)}
        {const releaseDate = playlist.release_date
          ? formatDate(playlist.release_date)
          : undefined}

        <HeroSection
          pictureSrc={playlist.artwork_url}
          title={playlist.title}
          user={playlist.user}
          description={dedent`${playlist.track_count} tracks
            ${releaseDate ?? ''}
            ${playlist.label_name ?? ''}`.trim()}
        />
      {/snippet}
    </QueryView>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView
      query={playlistTracksQuery}
      orderedIds={playlistQuery.data?.tracks?.map(track => track.id)}
    />
  {/snippet}
</Main>
