declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    buildExcludes?: (string | RegExp)[];
    publicExcludes?: string[];
    skipWaiting?: boolean;
    clientsClaim?: boolean;
    cleanupOutdatedCaches?: boolean;
    disableDevLogs?: boolean;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
