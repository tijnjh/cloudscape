import { PUBLIC_DEFAULT_INSTANCE } from "$env/static/public";
import { ReactiveValue } from "./reactive-value.svelte";
import type { Track } from "./schemas/track";
import type { AccentColor, BaseColor } from "./theme";
import { PersistedState } from "runed";

export const nowPlaying = new PersistedState<Track | null>("now-playing", null);
export const favoriteTrackIds = new PersistedState<number[]>("favorites", []);
export const showNowPlayingView = new ReactiveValue(false);
export const isPaused = new ReactiveValue(true);

export const selectedInstance = new PersistedState<string | undefined>(
  "selected-instance",
  PUBLIC_DEFAULT_INSTANCE,
);

export const selectedBaseColor = new PersistedState<BaseColor>(
  "selected-base-color",
  "mist",
);

export const selectedAccentColor = new PersistedState<AccentColor>(
  "selected-accent-color",
  "emerald",
);

export const isBlackAccent = new PersistedState<boolean>(
  "is-black-accent",
  false,
);
