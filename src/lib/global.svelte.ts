import type { Track } from "./schemas/track";
import type { Theme } from "./types";
import { PersistedState } from "runed";

export const nowPlaying = new PersistedState<Track | null>("now-playing", null);
export const favoriteTrackIds = new PersistedState<number[]>("favorites", []);

interface Global {
  showNowPlayingView: boolean;
  isPaused: boolean;

  theme: Theme;
}

export const global = $state<Global>({
  showNowPlayingView: false,
  isPaused: true,
  theme: {},
});
