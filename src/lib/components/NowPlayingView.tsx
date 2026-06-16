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
import { useRouterState } from '@tanstack/react-router'
import { cn } from 'cnfn'
import { useAtom, useAtomValue } from 'jotai'
import { XIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import TrackListing from './listings/TrackListing'
import UserListing from './listings/UserListing'
import { useTrackListingMenuActions } from './listings/useTrackListingMenuActions'
import Menu from './Menu'
import QueryView from './QueryView'
import Button from './ui/Button'

export default function NowPlayingView() {
  const nowPlaying = useAtomValue(nowPlayingAtom)
  const [isPaused, setIsPaused] = useAtom(isPausedAtom)
  const selectedInstance = useAtomValue(selectedInstanceAtom)
  const [showNowPlayingView, setShowNowPlayingView] = useAtom(showNowPlayingViewAtom)
  const pathname = useRouterState({ select: state => state.location.pathname })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPausedRef = useRef(isPaused)
  const isSwitchingSourceRef = useRef(false)
  const menuActions = useTrackListingMenuActions(nowPlaying)

  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    if (nowPlaying) {
      if ('mediaSession' in navigator) {
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
  }, [nowPlaying, setIsPaused])

  useEffect(() => {
    setShowNowPlayingView(false)
  }, [pathname, setShowNowPlayingView])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setShowNowPlayingView(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setShowNowPlayingView])

  useEffect(() => {
    const element = audioRef.current

    if (!element || !nowPlaying || !selectedInstance)
      return

    isSwitchingSourceRef.current = true

    const hls = applySource(nowPlaying, selectedInstance, element, () => {
      if (!isPausedRef.current) {
        playElement(element)
      }
    })

    const sourceSwapTimeout = window.setTimeout(() => {
      isSwitchingSourceRef.current = false
    }, 1000)

    return () => {
      isSwitchingSourceRef.current = true
      window.clearTimeout(sourceSwapTimeout)
      hls.destroy()
    }
  }, [nowPlaying, selectedInstance])

  useEffect(() => {
    const element = audioRef.current

    if (!element)
      return

    if (isPaused) {
      element.pause()
    }
    else if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
      playElement(element)
    }
  }, [isPaused])

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
        'fixed inset-x-0 z-30 grid h-full grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-base-300-700/75 p-4 backdrop-blur-lg transition-[top] duration-300 md:grid-cols-2',
        showNowPlayingView ? 'top-0' : 'top-full',
      )}
    >
      <div className="flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm">
        {nowPlaying?.artwork_url
          ? (
              <img
                src={nowPlaying.artwork_url.replace('large', 't500x500')}
                className="mt-12 aspect-square w-full rounded-xl"
                alt=""
              />
            )
          : (
              <div className="mt-12 aspect-square w-full rounded-xl bg-base-300-700 md:max-w-md" />
            )}

        {nowPlaying && (
          <hgroup className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-medium">
                {nowPlaying.title}
              </h1>

              <Menu actions={menuActions} />
            </div>

            <UserListing user={nowPlaying.user} />
          </hgroup>
        )}

        <audio
          ref={audioRef}
          className="h-10"
          controls
          onPlay={() => {
            isSwitchingSourceRef.current = false
            setIsPaused(false)
          }}
          onPause={() => {
            if (isSwitchingSourceRef.current && !isPausedRef.current)
              return

            setIsPaused(true)
          }}
        />
      </div>

      <div className="mt-8 flex w-full flex-col gap-4 md:h-dvh md:max-w-sm">
        <h2 className="text-xl font-medium">Related Tracks</h2>

        <QueryView query={relatedTracksQuery}>
          {data => (
            <>
              {data.length === 0
                ? (
                    <span className="text-xl font-medium text-base-900-100/25">
                      No related tracks found...
                    </span>
                  )
                : data.map(track => (
                    <TrackListing key={track.id} track={track} />
                  ))}
            </>
          )}
        </QueryView>
      </div>

      <Button
        size="icon"
        onClick={() => setShowNowPlayingView(false)}
        className="sticky bottom-4 max-md:mt-16 md:absolute md:top-4 md:right-4"
        icon={XIcon}
      />
    </div>
  )
}

function applySource(
  track: Track,
  selectedInstance: string,
  element: HTMLAudioElement,
  onReady: VoidFunction,
) {
  const url = `${selectedInstance}/_/api/hls/${track.user.permalink}/${track.permalink}`

  if (!Hls.isSupported()) {
    throw new Error('hls is not supported')
  }

  const hls = new Hls()
  hls.on(Hls.Events.MANIFEST_PARSED, onReady)
  hls.loadSource(url)
  hls.attachMedia(element)

  return hls
}

function playElement(element: HTMLAudioElement) {
  element.play().catch(() => {
    // The browser may reject while a new HLS source is still attaching.
  })
}
