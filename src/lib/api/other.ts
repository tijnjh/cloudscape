import { PUBLIC_SOUNDCLOAK_INSTANCES_URL } from "$env/static/public";
import ky from "ky";

export interface Instance {
  URL: string;
  Onion: string;
  I2P: string;
  I2PA: string;
  I2PAH: string;
  Ygg: string;
  YggD: string;
  YggA: string;
  Settings: {
    Commit: string;
    Repo: string;
    ProxyImages: boolean;
    ProxyStreams: boolean;
    Restream: boolean;
    EnableAPI: boolean;
  };
  Status: {
    Error: string;
    SkippedResolve: boolean;
  };
  Host: {
    IP: string;
    Organisation: string;
    ASN: string;
    Country: string;
    Anycast: boolean;
  };
}

export async function getSoundcloakInstances() {
  return await ky.get<Instance[]>(PUBLIC_SOUNDCLOAK_INSTANCES_URL).json();
}
