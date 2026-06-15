import * as v from 'valibot'

export const SoundcloakInstance = v.strictObject({
  URL: v.string(),
  Onion: v.string(),
  I2P: v.string(),
  I2PA: v.string(),
  I2PAH: v.string(),
  Ygg: v.string(),
  YggD: v.string(),
  YggA: v.string(),
  Settings: v.strictObject({
    Commit: v.string(),
    Repo: v.string(),
    ProxyImages: v.boolean(),
    ProxyStreams: v.boolean(),
    Restream: v.boolean(),
    EnableAPI: v.boolean(),
  }),
  Status: v.strictObject({
    Error: v.string(),
    SkippedResolve: v.boolean(),
  }),
  Host: v.strictObject({
    IP: v.string(),
    Organisation: v.string(),
    ASN: v.string(),
    Country: v.string(),
    Anycast: v.boolean(),
  }),
})

export type SoundcloakInstance = v.InferOutput<typeof SoundcloakInstance>
