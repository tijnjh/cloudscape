<script module lang='ts'>
  import type { User } from '$lib/schemas/user'

  export interface HeroSectionProps {
    pictureSrc?: string | null
    title: string
    badges?: (string | false)[]
    description?: string | null
    user?: User
    roundedPicture?: boolean
  }
</script>

<script lang='ts'>
  import { cn } from 'cnfn'
  import UserListing from './listings/UserListing.svelte'
  import Badge from './ui/Badge.svelte'
  import Collapsible from './ui/Collapsible.svelte'

  const {
    pictureSrc,
    title,
    description,
    badges,
    user,
    roundedPicture = false,
  }: HeroSectionProps = $props()
</script>

{#if pictureSrc}
  <img
    src={pictureSrc.replace('large', 't500x500')}
    width='500'
    height='500'
    {@attach (node) => {
      node.onerror = () => {
        node.src = pictureSrc
      }
    }}
    class={cn(
      'mx-auto my-4 aspect-square w-full max-w-xs',
      roundedPicture ? 'rounded-full' : 'rounded-xl',
    )}
    alt={title}
  />
{/if}

<div class='flex items-center gap-2'>
  <h1 class='text-2xl font-medium'>{title}</h1>
  {#if badges}
    <div class='flex gap-2'>
      {#each badges as badge (badge)}
        {#if badge}
          <Badge label={badge} />
        {/if}
      {/each}
    </div>
  {/if}
</div>

{#if user}
  <div class='flex flex-col gap-4'>
    <UserListing {user} />
  </div>
{/if}

{#if description}
  <Collapsible summary='Description'>
    <p class='whitespace-pre-wrap text-base-600-400'>
      {description}
    </p>
  </Collapsible>
{/if}
