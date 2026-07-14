import type { Track } from '$lib/schemas/track'
import { getRelatedTracks } from '$lib/api/discovery'
import {
  isPausedAtom,
  nowPlayingAtom,
  selectedInstanceAtom,
  showNowPlayingViewAtom,
} from '$lib/global'
import { Hls } from '$lib/hls'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { cn } from 'cnfast'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BlockedTrackNotice } from './BlockedTrackNotice'
import { TrackListing, useTrackListingMenuActions } from './listings/TrackListing'
import { UserListing } from './listings/UserListing'
import { Menu } from './Menu'
import { QueryView } from './QueryView'
import { Button } from './ui/Button'

function AudioPlayer({ track }: { track: Track }) {
  const elementRef = useRef<HTMLAudioElement>(null)
  const activeRef = useRef(true)
  const commandRef = useRef<'pause' | 'play' | null>(null)
  const selectedInstance = useAtomValue(selectedInstanceAtom)
  const [isPaused, setIsPaused] = useAtom(isPausedAtom)
  const [readySource, setReadySource] = useState<string | null>(null)
  const source = selectedInstance
    ? `${selectedInstance}/_/api/hls/${track.user.permalink}/${track.permalink}`
    : null

  useEffect(() => {
    activeRef.current = true
    return () => {
      activeRef.current = false
    }
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !source)
      return

    if (!Hls.isSupported())
      throw new Error('hls is not supported')

    const hls = new Hls()
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (activeRef.current)
        setReadySource(source)
    })
    hls.loadSource(source)
    hls.attachMedia(element)
    return () => hls.destroy()
  }, [source])

  useEffect(() => {
    const element = elementRef.current
    if (!element || readySource !== source)
      return

    if (element.paused === isPaused) {
      commandRef.current = null
      return
    }

    if (isPaused) {
      commandRef.current = 'pause'
      element.pause()
    }
    else {
      commandRef.current = 'play'
      element.play().catch(() => {
        if (activeRef.current && commandRef.current === 'play') {
          commandRef.current = null
          setIsPaused(true)
        }
      })
    }
  }, [isPaused, readySource, setIsPaused, source])

  return (
    <audio
      ref={elementRef}
      className='h-10'
      controls
      onPlay={() => {
        if (commandRef.current === 'play') {
          commandRef.current = null
          return
        }
        if (commandRef.current !== 'pause')
          setIsPaused(false)
      }}
      onPause={() => {
        if (commandRef.current === 'pause') {
          commandRef.current = null
          return
        }
        if (commandRef.current !== 'play')
          setIsPaused(true)
      }}
    />
  )
}

function NowPlayingMenu({ track }: { track: Track }) {
  const actions = useTrackListingMenuActions(track)
  return <Menu actions={actions} />
}

export function NowPlayingView() {
  const location = useLocation()
  const nowPlaying = useAtomValue(nowPlayingAtom)
  const showNowPlayingView = useAtomValue(showNowPlayingViewAtom)
  const setShowNowPlayingView = useSetAtom(showNowPlayingViewAtom)
  const isBlocked = nowPlaying?.policy === 'BLOCK'

  useEffect(() => {
    if (nowPlaying) {
      if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: nowPlaying.title,
          artist: nowPlaying.user.username,
          album: 'Cloudscape',
          artwork: [
            {
              src: nowPlaying.artwork_url?.replace('large', 't500x500') ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  }, [nowPlaying])

  useEffect(() => {
    setShowNowPlayingView(false)
  }, [location.pathname, setShowNowPlayingView])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowNowPlayingView(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setShowNowPlayingView])

  const relatedTracksQuery = useQuery({
    queryKey: ['related', nowPlaying?.id],
    queryFn: async () => {
      if (!nowPlaying)
        return []

      const relatedTracks = await getRelatedTracks(nowPlaying.id)

      return relatedTracks.collection
    },
  })

  return (
    <div
      className={cn(
        'fixed inset-0 z-30 grid grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-base-300-700/75 p-4 backdrop-blur-lg transition-[translate,opacity] duration-300 ease-drawer will-change-[translate,opacity] motion-reduce:translate-y-0 motion-reduce:duration-200 motion-reduce:ease-out md:grid-cols-2',
        showNowPlayingView
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <div className='flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm'>
        {nowPlaying?.artwork_url
          ? (
              <img
                src={nowPlaying.artwork_url.replace('large', 't500x500')}
                width='500'
                height='500'
                className='mt-12 aspect-square w-full rounded-xl'
                alt=''
              />
            )
          : (
              <div
                className='mt-12 aspect-square w-full rounded-xl bg-base-300-700 md:max-w-md'
              />
            )}

        {nowPlaying && (
          <hgroup className='flex flex-col gap-4'>
            <div className='flex items-center justify-between gap-4'>
              <h1 className='text-2xl font-medium'>
                {nowPlaying.title}
              </h1>

              <NowPlayingMenu track={nowPlaying} />
            </div>

            <UserListing user={nowPlaying.user} />
          </hgroup>
        )}

        {isBlocked
          ? <BlockedTrackNotice />
          : nowPlaying && <AudioPlayer key={nowPlaying.id} track={nowPlaying} />}
      </div>

      <div className='mt-8 flex w-full flex-col gap-4 md:h-dvh md:max-w-sm'>
        <h2 className='text-xl font-medium'>Related Tracks</h2>

        <QueryView
          query={relatedTracksQuery}
          content={data => data.length === 0
            ? (
                <span className='text-xl font-medium text-base-900-100/25'>
                  No related tracks found...
                </span>
              )
            : data.map(track => <TrackListing key={track.id} track={track} />)}
        />
      </div>

      <Button
        size='icon'
        onClick={() => setShowNowPlayingView(false)}
        className='sticky bottom-4 max-md:mt-16 md:absolute md:top-4 md:right-4'
        icon={XIcon}
      />
    </div>
  )
}
