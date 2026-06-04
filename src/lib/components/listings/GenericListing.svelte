<script module lang="ts">
  import type { ListingThumbnailProps } from "../ListingThumbnail.svelte";
  import type { LucideIcon } from "@lucide/svelte";
  import type { ButtonRootProps } from "bits-ui";
  import type { MergeExclusive } from "type-fest";

  export type Action = MergeExclusive<
    {
      label: string;
      icon: LucideIcon;
      onclick: VoidFunction;
    },
    {
      label: string;
      icon: LucideIcon;
      href: string;
    }
  >;

  export type GenericListingProps = ButtonRootProps & {
    title: string;
    badges?: (string | false)[];
    subtitle: string;
    thumbnail: ListingThumbnailProps;
    actions?: Action[];
  };
</script>

<script lang="ts">
  import ListingThumbnail from "../ListingThumbnail.svelte";
  import Menu from "../Menu.svelte";
  import Badge from "../ui/Badge.svelte";
  import { Button as BitsUiButton } from "bits-ui";

  const {
    title,
    badges,
    subtitle,
    thumbnail,
    actions,
    ...props
  }: GenericListingProps = $props();
</script>

<div class="flex items-center gap-4 text-left">
  <BitsUiButton.Root
    {...props}
    class={[
      "flex w-full min-w-0 isolate cursor-pointer gap-4 text-left relative transition-transform active:scale-95 active:opacity-50",
      "before:-z-10 before:content-[''] before:absolute before:-inset-2 before:rounded-[10px] before:bg-base-300-700",
      "before:opacity-0 hover:before:opacity-100 before:transition-[opacity,scale] before:scale-90 hover:before:scale-100",
    ]}
  >
    <ListingThumbnail {...thumbnail} />

    <div class="flex flex-col truncate">
      <div class="flex gap-2">
        <h3 class="truncate">{title}</h3>

        {#each badges as badge (badge)}
          {#if badge}
            <Badge label={badge} />
          {/if}
        {/each}
      </div>
      <p class="truncate text-accent/75">
        {subtitle}
      </p>
    </div>
  </BitsUiButton.Root>

  {#if actions}
    <Menu {actions} {title} {subtitle} />
  {/if}
</div>
