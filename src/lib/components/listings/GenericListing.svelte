<script module lang='ts'>
  import type { LucideIcon } from '@lucide/svelte'
  import type { ButtonRootProps } from 'bits-ui'
  import type { MergeExclusive } from 'type-fest'
  import type { ListingThumbnailProps } from '../ListingThumbnail.svelte'

  export type Action = MergeExclusive<
    {
      label: string
      icon: LucideIcon
      onclick: VoidFunction
    },
    {
      label: string
      icon: LucideIcon
      href: string
    }
  >

  export type GenericListingProps = ButtonRootProps & {
    title: string
    badges?: (string | false)[]
    subtitle: string
    thumbnail: ListingThumbnailProps
    actions?: Action[]
  }
</script>

<script lang='ts'>
  import { Button as BitsUiButton } from 'bits-ui'
  import ListingThumbnail from '../ListingThumbnail.svelte'
  import Menu from '../Menu.svelte'
  import Badge from '../ui/Badge.svelte'

  const {
    title,
    badges,
    subtitle,
    thumbnail,
    actions,
    disabled,
    ...props
  }: GenericListingProps = $props()
</script>

<div class='flex items-center gap-4 text-left'>
  <BitsUiButton.Root
    {...props}
    {disabled}
    class={[
      'relative isolate flex w-full min-w-0 gap-4 text-left transition-transform',
      disabled
        ? 'cursor-not-allowed opacity-50'
        : 'cursor-pointer active:scale-95 active:opacity-50',
      'before:absolute before:-inset-2 before:-z-10 before:rounded-[10px] before:bg-base-300-700 before:content-[\'\']',
      'before:scale-90 before:opacity-0 before:transition-[opacity,scale] hover:before:scale-100 hover:before:opacity-100',
      disabled && 'before:hidden hover:before:scale-90 hover:before:opacity-0',
    ]}
  >
    <ListingThumbnail {...thumbnail} />

    <div class='flex flex-col truncate'>
      <div class='flex gap-2'>
        <h3 class='truncate'>{title}</h3>

        {#each badges as badge (badge)}
          {#if badge}
            <Badge label={badge} />
          {/if}
        {/each}
      </div>
      <p class='truncate text-accent/75'>
        {subtitle}
      </p>
    </div>
  </BitsUiButton.Root>

  {#if actions}
    <Menu {actions} {title} {subtitle} />
  {/if}
</div>
