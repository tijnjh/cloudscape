import { Schema } from 'effect'

export const SoundcloakInstance = Schema.Struct({
  URL: Schema.String,
  Onion: Schema.String,
  I2P: Schema.String,
  I2PA: Schema.String,
  I2PAH: Schema.String,
  Ygg: Schema.String,
  YggD: Schema.String,
  YggA: Schema.String,
  Settings: Schema.Struct({
    Commit: Schema.String,
    Repo: Schema.String,
    ProxyImages: Schema.Boolean,
    ProxyStreams: Schema.Boolean,
    Restream: Schema.Boolean,
    EnableAPI: Schema.Boolean,
  }),
  Status: Schema.Struct({
    Error: Schema.String,
    SkippedResolve: Schema.Boolean,
  }),
  Host: Schema.Struct({
    IP: Schema.String,
    Organisation: Schema.String,
    ASN: Schema.String,
    Country: Schema.String,
    Anycast: Schema.Boolean,
  }),
})

export type SoundcloakInstance = typeof SoundcloakInstance.Type
