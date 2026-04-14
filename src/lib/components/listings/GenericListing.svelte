<script module lang="ts">
  import type { ListingThumbnailProps } from "../ListingThumbnail.svelte";
  import type { LucideProps } from "@lucide/svelte";
  import type { ButtonRootProps } from "bits-ui";
  import type { Component } from "svelte";
  import type { MergeExclusive } from "type-fest";

  export type Action = MergeExclusive<
    {
      label: string;
      icon: Component<LucideProps>;
      onclick: VoidFunction;
    },
    {
      label: string;
      icon: Component<LucideProps>;
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
      "before:-z-10 before:content-[''] before:absolute before:-inset-2 before:rounded-[10px] before:bg-mist-300-700",
      "before:opacity-0 hover:before:opacity-100 before:transition-[opacity,scale] before:scale-90 hover:before:scale-100",
    ]}
  >
    <ListingThumbnail {...thumbnail} />

    <div class="flex flex-col truncate">
      <div class="flex gap-2">
        <h3 class="truncate">{title}</h3>

        {#each badges as badge (badge)}
          {#if badge}
            <div
              class="rounded-full bg-mist-300-700 px-2 py-0.5 text-sm whitespace-nowrap text-mist-600-400"
            >
              {badge}
            </div>
          {/if}
        {/each}
      </div>
      <p class="truncate opacity-50">
        {subtitle}
      </p>
    </div>
  </BitsUiButton.Root>

  {#if actions}
    <Menu {actions} {title} {subtitle} />
  {/if}
</div>
