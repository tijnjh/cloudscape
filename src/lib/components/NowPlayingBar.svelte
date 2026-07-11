<script lang='ts'>
  import { isPaused, nowPlaying, showNowPlayingView } from '$lib/global.svelte'
  import { AnimatePresence, motion } from '@humanspeak/svelte-motion'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { hapticTrigger } from 'ios-haptics'
  import { MediaQuery } from 'svelte/reactivity'
  import { fly } from 'svelte/transition'
  import ListingThumbnail from './ListingThumbnail.svelte'
  import Button from './ui/Button.svelte'

  const StatusIcon = $derived(isPaused.current ? PlayIcon : PauseIcon)
  const isBlocked = $derived(nowPlaying.current?.policy === 'BLOCK')
  const reduceMotion = new MediaQuery('(prefers-reduced-motion: reduce)')
</script>

{#if !showNowPlayingView.current}
  <div
    data-material
    in:fly={{ y: reduceMotion.current ? 0 : 100, duration: 200 }}
    class='fixed inset-x-2 bottom-2 z-30 mx-auto rounded-2xl border border-base-50/25 bg-base-100-900/72 shadow-xl shadow-base-950/15 backdrop-blur-2xl backdrop-saturate-150 md:inset-x-4 md:bottom-4 md:max-w-xl dark:border-white/10 dark:shadow-black/35'
  >
    <div class='grid grid-cols-[1fr_auto] items-center gap-4 p-3'>
      <button
        onclick={() => (showNowPlayingView.current = true)}
        class='flex gap-4 truncate text-left transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-accent active:opacity-60'
      >
        <div class='relative size-12 shrink-0 overflow-hidden rounded-sm'>
          {#if nowPlaying.current}
            <AnimatePresence>
              {#key nowPlaying.current.id}
                <motion.div
                  key={nowPlaying.current.id.toString()}
                  transition={reduceMotion.current
                    ? { duration: 0.15 }
                    : { ease: 'easeInOut', duration: 0.2 }}
                  class='absolute inset-0'
                  initial={reduceMotion.current
                    ? { opacity: 0 }
                    : { scale: 0.96, filter: 'blur(2px)', opacity: 0 }}
                  animate={reduceMotion.current
                    ? { opacity: 1 }
                    : { scale: 1, filter: 'blur(0px)', opacity: 1 }}
                  exit={reduceMotion.current
                    ? { opacity: 0 }
                    : { scale: 0.96, filter: 'blur(2px)', opacity: 0 }}
                >
                  <ListingThumbnail
                    src={nowPlaying.current?.artwork_url}
                    alt=""
                  />
                </motion.div>
              {/key}
            </AnimatePresence>
          {/if}
        </div>

        <div class='flex w-full min-w-0 flex-col'>
          <h3 class='m-0 truncate p-0 font-medium tracking-[-0.01em]'>
            {nowPlaying.current?.title ?? ''}
          </h3>
          <p class='truncate opacity-50'>
            {nowPlaying.current?.user.username ?? ''}
          </p>
        </div>
      </button>

      <Button
        size='icon'
        disabled={isBlocked}
        {@attach !isBlocked && hapticTrigger}
        onclick={() => {
          isPaused.current = !isPaused.current
        }}
      >
        <motion.div
          transition={reduceMotion.current
            ? { duration: 0.15 }
            : { type: 'spring', duration: 0.3, bounce: 0 }}
          initial={reduceMotion.current
            ? { opacity: 0 }
            : { rotate: 180, scale: 0.95, filter: 'blur(2px)' }}
          animate={reduceMotion.current
            ? { opacity: 1 }
            : isPaused.current
            ? { rotate: 360, scale: 1, filter: 'blur(0px)' }
            : { rotate: 180, scale: 1, filter: 'blur(0px)' }}
        >
          <StatusIcon fill='currentColor' size={16} />
        </motion.div>
      </Button>
    </div>
  </div>
{/if}
