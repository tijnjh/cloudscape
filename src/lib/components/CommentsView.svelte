<script lang='ts'>
  import { getTrackComments } from '$lib/api/track'
  import { max_items_per_page } from '$lib/constants'
  import { whenInView } from '$lib/utils'
  import { createInfiniteQuery } from '@tanstack/svelte-query'
  import { cubicOut } from 'svelte/easing'
  import { MediaQuery } from 'svelte/reactivity'
  import { fly } from 'svelte/transition'
  import Comment from './Comment.svelte'
  import ErrorDisplay from './ErrorDisplay.svelte'
  import Spinner from './Spinner.svelte'
  import Button from './ui/Button.svelte'

  const { trackId }: { trackId: number } = $props()
  const reduceMotion = new MediaQuery('(prefers-reduced-motion: reduce)')

  const commentsQuery = createInfiniteQuery(() => ({
    queryKey: ['track-comments', trackId],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getTrackComments({
        id: trackId,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })
      return result.collection
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  }))
</script>

{#if commentsQuery.isLoading}
  <Spinner />
{:else if commentsQuery.isError}
  <ErrorDisplay error={commentsQuery.error} />
{:else}
  <div
    in:fly={{ y: reduceMotion.current ? 0 : 16, duration: 200, easing: cubicOut }}
    class='flex flex-col gap-6'
  >
    {#each commentsQuery.data?.pages ?? [] as page (page)}
      {#each page as comment (comment.id)}
        <Comment {comment} />
      {/each}
    {:else}
      <span class='mt-4 text-lg text-base-100-900/25'>No comments yet...</span>
    {/each}
  </div>
{/if}

{#if commentsQuery.hasNextPage}
  <Button
    class='mt-8 w-full'
    onclick={() => {
      commentsQuery.fetchNextPage()
    }}
    {@attach whenInView(() => {
      if (commentsQuery.isFetching) {
        return
      }
      commentsQuery.fetchNextPage()
    })}
  >
    Load more
  </Button>
{/if}
