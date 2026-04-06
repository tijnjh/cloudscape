<script lang="ts">
  import { getSearchSuggestions } from "$lib/api/discovery";
  import Input from "./ui/Input.svelte";
  import { SearchIcon } from "@lucide/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";

  let { value = $bindable() }: { value?: string } = $props();

  const debouncedValue = new Debounced(() => value);

  const searchSuggestionsQuery = createQuery(() => ({
    queryKey: ["search-suggestions", debouncedValue.current],
    queryFn: () => getSearchSuggestions(debouncedValue.current!),
    enabled: !!debouncedValue.current,
  }));
</script>

<form action="search" class="w-full">
  <Input
    type="text"
    name="q"
    placeholder="Search for artists, tracks or playlists..."
    class="w-full"
    id="search-input"
    list="search-suggestions"
    icon={SearchIcon}
    bind:value
  />
  <datalist id="search-suggestions">
    {#if searchSuggestionsQuery.data}
      {#each searchSuggestionsQuery.data.collection as suggestion (suggestion.query)}
        <option>{suggestion.query}</option>
      {/each}
    {/if}
  </datalist>
</form>
