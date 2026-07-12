import { isPausedAtom, nowPlayingAtom, showNowPlayingViewAtom } from '$lib/global'
import { hapticTrigger } from 'ios-haptics'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ListingThumbnail from './ListingThumbnail'
import Button from './ui/Button'

export default function NowPlayingBar() {
  const nowPlaying = useAtomValue(nowPlayingAtom)
  const showNowPlayingView = useAtomValue(showNowPlayingViewAtom)
  const setShowNowPlayingView = useSetAtom(showNowPlayingViewAtom)
  const [isPaused, setIsPaused] = useAtom(isPausedAtom)
  const reduceMotion = useReducedMotion()
  const StatusIcon = isPaused ? PlayIcon : PauseIcon
  const isBlocked = nowPlaying?.policy === 'BLOCK'

  return (
    <AnimatePresence>
      {!showNowPlayingView && (
        <motion.div
          initial={{ y: reduceMotion ? 0 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduceMotion ? 0 : 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-x-2 bottom-2 z-30 mx-auto rounded-2xl bg-base-300-700/75 backdrop-blur-lg md:inset-x-4 md:bottom-4 md:max-w-xl'
        >
          <div className='grid grid-cols-[1fr_auto] items-center gap-4 p-3'>
            <button
              onClick={() => setShowNowPlayingView(true)}
              className='flex gap-4 truncate text-left'
            >
              <div className='relative size-12 shrink-0 overflow-hidden rounded-sm'>
                <AnimatePresence>
                  {nowPlaying && (
                    <motion.div
                      key={nowPlaying.id}
                      transition={reduceMotion
                        ? { duration: 0.15 }
                        : { ease: 'easeInOut', duration: 0.2 }}
                      className='absolute inset-0'
                      initial={reduceMotion
                        ? { opacity: 0 }
                        : { scale: 0.96, filter: 'blur(2px)', opacity: 0 }}
                      animate={reduceMotion
                        ? { opacity: 1 }
                        : { scale: 1, filter: 'blur(0px)', opacity: 1 }}
                      exit={reduceMotion
                        ? { opacity: 0 }
                        : { scale: 0.96, filter: 'blur(2px)', opacity: 0 }}
                    >
                      <ListingThumbnail
                        src={nowPlaying.artwork_url}
                        alt=''
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='flex w-full min-w-0 flex-col'>
                <h3 className='m-0 truncate p-0'>
                  {nowPlaying?.title ?? ''}
                </h3>
                <p className='truncate opacity-50'>
                  {nowPlaying?.user.username ?? ''}
                </p>
              </div>
            </button>

            <Button
              ref={isBlocked ? undefined : hapticTrigger}
              size='icon'
              disabled={isBlocked}
              onClick={() => setIsPaused(prev => !prev)}
            >
              <motion.div
                key={String(isPaused)}
                transition={reduceMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', duration: 0.3, bounce: 0 }}
                initial={reduceMotion
                  ? { opacity: 0 }
                  : { rotate: 180, scale: 0.95, filter: 'blur(2px)' }}
                animate={reduceMotion
                  ? { opacity: 1 }
                  : isPaused
                    ? { rotate: 360, scale: 1, filter: 'blur(0px)' }
                    : { rotate: 180, scale: 1, filter: 'blur(0px)' }}
              >
                <StatusIcon fill='currentColor' size={16} />
              </motion.div>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
