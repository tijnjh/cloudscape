<script module lang="ts">
  import type { ListingThumbnailProps } from "../ListingThumbnail.svelte";
  import type { ButtonRootProps } from "bits-ui";
  import type { MergeExclusive } from "type-fest";

  export type GenericListingProps = ButtonRootProps & {
    title: string;
    badges?: (string | false)[];
    subtitle: string;
    thumbnail: ListingThumbnailProps;
    actions?: (
      | MergeExclusive<
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
        >
      | undefined
    )[];
  };
</script>

<script lang="ts">
  import ListingThumbnail from "../ListingThumbnail.svelte";
  import Button from "../ui/Button.svelte";
  import type { LucideProps } from "@lucide/svelte";
  import { Button as BitsUiButton } from "bits-ui";
  import type { Component } from "svelte";

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
    class="flex w-full min-w-0 gap-4 text-left transition-transform active:scale-95 active:opacity-50"
  >
    <ListingThumbnail {...thumbnail} />

    <div class="flex flex-col truncate">
      <div class="flex gap-2">
        <h3 class="truncate">{title}</h3>

        {#each badges as badge (badge)}
          {#if badge}
            <div
              class="bg-mist-300-700 text-mist-600-400 rounded-full px-2 py-0.5 text-sm whitespace-nowrap"
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
    {#each actions as action (action?.label)}
      {#if action}
        <Button
          icon={action.icon}
          title={action.label}
          onclick={action.onclick}
          class="shrink-0"
          href={action.href}
          variant="secondary"
          size="icon"
        />
      {/if}
    {/each}
  {/if}
</div>
