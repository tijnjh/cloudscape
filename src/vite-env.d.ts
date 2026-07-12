/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_DEFAULT_INSTANCE?: string
  readonly PUBLIC_SOUNDCLOAK_INSTANCES_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
