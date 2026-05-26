<script module lang="ts">
  import type { ListingThumbnailProps } from "../ListingThumbnail.svelte";
  import { EllipsisIcon, type LucideProps } from "@lucide/svelte";
  import type { Component } from "svelte";

  export type GenericListingProps = ButtonProps & {
    title: string;
    badges?: (string | false)[];
    subtitle: string;
    thumbnail: ListingThumbnailProps;
    actions?: Array<{
      label: string;
      icon: Component<LucideProps>;
      onSelect: VoidFunction;
    }>;
  };
</script>

<script lang="ts">
  import { Button, type ButtonProps } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import ListingThumbnail from "../ListingThumbnail.svelte";
  import { Badge } from "../ui/badge";
  import * as Item from "../ui/item";

  const {
    title,
    badges,
    subtitle,
    thumbnail,
    actions,
    ...props
  }: GenericListingProps = $props();
</script>

<Item.Root variant="outline">
  {#snippet child({ props })}
    <a {...props}>
      <Item.Media variant="icon">
        <ListingThumbnail {...thumbnail} />
      </Item.Media>

      <Item.Content>
        <Item.Title>
          {title}
          {#each badges?.filter(Boolean) as badge (badge)}
            <Badge>{badge}</Badge>
          {/each}
        </Item.Title>

        <Item.Description>
          {subtitle}
        </Item.Description>
      </Item.Content>

      {#if actions}
        <Item.Actions>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Button {...props}>
                  <EllipsisIcon />
                </Button>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {#each actions as { icon: Icon, onSelect, label } (label)}
                <DropdownMenu.Item {onSelect}>
                  {#if Icon}
                    <Icon />
                  {/if}
                  {label}
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Item.Actions>
      {/if}
    </a>
  {/snippet}
</Item.Root>

<!-- <div class="flex items-center gap-4 text-left">
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
            <Badge>
              {badge}
            </Badge>
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
</div> -->
