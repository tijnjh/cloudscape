import { ReactiveValue } from "./reactive-value.svelte";
import type { Track } from "./schemas/track";
import { PersistedState } from "runed";

export const nowPlaying = new PersistedState<Track | null>("now-playing", null);
export const favoriteTrackIds = new PersistedState<number[]>("favorites", []);
export const showNowPlayingView = new ReactiveValue(false);
export const isPaused = new ReactiveValue(true);
