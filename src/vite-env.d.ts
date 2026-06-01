/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_LAMBDA_URL?: string;
  readonly VITE_REACT_APP_WEBSOCKET_URL?: string;
  readonly VITE_VAPID_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
