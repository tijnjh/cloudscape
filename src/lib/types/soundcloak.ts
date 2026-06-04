export interface SoundcloakInstance {
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
