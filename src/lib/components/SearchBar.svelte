<script lang="ts">
  import { getSearchSuggestions } from "$lib/api/discovery";
  import Input from "./ui/Input.svelte";
  import { SearchIcon } from "@lucide/svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";

  let searchInput = $state<string>();

  const debouncedSearchInput = new Debounced(() => searchInput);

  const searchSuggestionsQuery = createQuery(() => ({
    queryKey: ["search-suggestions", debouncedSearchInput.current],
    queryFn: () => getSearchSuggestions(debouncedSearchInput.current!),
    enabled: !!debouncedSearchInput.current,
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
    bind:value={searchInput}
  />
  <datalist id="search-suggestions">
    {#if searchSuggestionsQuery.data}
      {#each searchSuggestionsQuery.data.collection as suggestion (suggestion.query)}
        <option>{suggestion.query}</option>
      {/each}
    {/if}
  </datalist>
</form>
