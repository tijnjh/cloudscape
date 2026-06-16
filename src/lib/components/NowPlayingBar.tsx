import { isPausedAtom, nowPlayingAtom, showNowPlayingViewAtom } from '$lib/global'
import { useAtom, useAtomValue } from 'jotai'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import ListingThumbnail from './ListingThumbnail'
import Button from './ui/Button'

export default function NowPlayingBar() {
  const nowPlaying = useAtomValue(nowPlayingAtom)
  const [showNowPlayingView, setShowNowPlayingView] = useAtom(showNowPlayingViewAtom)
  const [isPaused, setIsPaused] = useAtom(isPausedAtom)
  const StatusIcon = isPaused ? PlayIcon : PauseIcon

  if (showNowPlayingView) {
    return null
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed inset-x-2 bottom-2 z-30 mx-auto rounded-2xl bg-base-300-700/75 backdrop-blur-lg md:inset-x-4 md:bottom-4 md:max-w-xl"
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-3">
        <button
          type="button"
          onClick={() => setShowNowPlayingView(true)}
          className="flex gap-4 truncate text-left"
        >
          {nowPlaying && (
            <AnimatePresence mode="wait">
              <motion.div
                key={nowPlaying.id.toString()}
                transition={{ ease: 'easeInOut' }}
                className="aspect-square size-12 rounded-sm"
                initial={{
                  scale: 0.5,
                  filter: 'blur(4px)',
                  rotate: 15,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  filter: 'blur(0px)',
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.5,
                  filter: 'blur(10px)',
                  rotate: -15,
                  opacity: 0,
                }}
              >
                <ListingThumbnail
                  src={nowPlaying.artwork_url}
                  alt=""
                />
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex w-full min-w-0 flex-col">
            <h3 className="m-0 truncate p-0">
              <span className="inline-block">
                {nowPlaying?.title ?? ''}
              </span>
            </h3>
            <p className="truncate opacity-50">
              <span className="inline-block">
                {nowPlaying?.user.username ?? ''}
              </span>
            </p>
          </div>
        </button>

        <Button
          size="icon"
          onClick={() => {
            setIsPaused(!isPaused)
          }}
        >
          <motion.div
            initial={{
              rotate: 180,
              scale: 0,
              filter: 'blur(10px)',
            }}
            animate={isPaused
              ? { rotate: 360, scale: 1, filter: 'blur(0px)' }
              : { rotate: 180, scale: 1, filter: 'blur(0px)' }}
          >
            <StatusIcon fill="currentColor" size={16} />
          </motion.div>
        </Button>
      </div>
    </motion.div>
  )
}
