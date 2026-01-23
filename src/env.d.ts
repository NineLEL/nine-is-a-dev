/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DISCORD_WEBHOOK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
