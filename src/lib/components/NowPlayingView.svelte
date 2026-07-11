<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { onNavigate } from '$app/navigation'
  import { getRelatedTracks } from '$lib/api/discovery'
  import { isPaused, nowPlaying, selectedInstance, showNowPlayingView } from '$lib/global.svelte'
  import { Hls } from '$lib/hls'
  import { XIcon } from '@lucide/svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { cn } from 'cnfn'
  import BlockedTrackNotice from './BlockedTrackNotice.svelte'
  import TrackListing, { getTrackListingMenuActions } from './listings/TrackListing.svelte'
  import UserListing from './listings/UserListing.svelte'
  import Menu from './Menu.svelte'
  import QueryView from './QueryView.svelte'
  import Button from './ui/Button.svelte'

  const isBlocked = $derived(nowPlaying.current?.policy === 'BLOCK')

  $effect(() => {
    if (nowPlaying.current) {
      isPaused.current = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: nowPlaying.current.title,
          artist: nowPlaying.current.user.username,
          album: 'Cloudscape',
          artwork: [
            {
              src: nowPlaying.current.artwork_url?.replace('large', 't500x500') ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  })

  const applySource = (track: Track) => (element: HTMLAudioElement) => {
    const url = `${selectedInstance.current}/_/api/hls/${track.user.permalink}/${track.permalink}`

    if (!Hls.isSupported()) {
      throw new Error('hls is not supported')
    }
    const hls = new Hls()
    hls.loadSource(url)
    hls.attachMedia(element)
  }

  onNavigate(() => {
    showNowPlayingView.current = false
  })

  const relatedTracksQuery = createQuery(() => ({
    queryKey: ['related', nowPlaying.current?.id],
    queryFn: async () => {
      if (!nowPlaying.current)
        return []

      const relatedTracks = await getRelatedTracks(nowPlaying.current.id)

      return relatedTracks.collection
    },
  }))
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      showNowPlayingView.current = false
    }
  }}
/>

<div
  class={cn(
    'fixed inset-0 z-30 grid grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-base-300-700/75 p-4 backdrop-blur-lg transition-[translate,opacity] duration-300 ease-drawer will-change-[translate,opacity] motion-reduce:translate-y-0 motion-reduce:duration-200 motion-reduce:ease-out md:grid-cols-2',
    showNowPlayingView.current
      ? 'translate-y-0 opacity-100'
      : 'pointer-events-none translate-y-full opacity-0',
  )}
>
  <div class='flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm'>
    {#if nowPlaying.current?.artwork_url}
      <img
        src={nowPlaying.current.artwork_url.replace('large', 't500x500')}
        width='500'
        height='500'
        class='mt-12 aspect-square w-full rounded-xl'
        alt=""
      />
    {:else}
      <div
        class='mt-12 aspect-square w-full rounded-xl bg-base-300-700 md:max-w-md'
      ></div>
    {/if}

    {#if nowPlaying.current}
      <hgroup class='flex flex-col gap-4'>
        <div class='flex items-center justify-between gap-4'>
          <h1 class='text-2xl font-medium'>
            {nowPlaying.current?.title}
          </h1>

          <Menu actions={getTrackListingMenuActions(nowPlaying.current)} />
        </div>

        <UserListing user={nowPlaying.current.user} />
      </hgroup>
    {/if}

    {#if isBlocked}
      <BlockedTrackNotice />
    {:else if nowPlaying.current}
      {#key nowPlaying.current}
        <audio
          class='h-10'
          bind:paused={isPaused.current}
          controls
          {@attach applySource(nowPlaying.current)}
        >
        </audio>
      {/key}
    {/if}
  </div>

  <div class='mt-8 flex w-full flex-col gap-4 md:h-dvh md:max-w-sm'>
    <h2 class='text-xl font-medium'>Related Tracks</h2>

    <QueryView query={relatedTracksQuery}>
      {#snippet content(data)}
        {#if data.length === 0}
          <span class='text-xl font-medium text-base-900-100/25'>
            No related tracks found...
          </span>
        {:else if data}
          {#each data as track (track.id)}
            <TrackListing {track} />
          {/each}
        {/if}
      {/snippet}
    </QueryView>
  </div>

  <Button
    size='icon'
    onclick={() => (showNowPlayingView.current = false)}
    class='sticky bottom-4 max-md:mt-16 md:absolute md:top-4 md:right-4'
    icon={XIcon}
  />
</div>
