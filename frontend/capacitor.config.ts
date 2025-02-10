import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umiuat.app',
  appName: 'umiuat',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
