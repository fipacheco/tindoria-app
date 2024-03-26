import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tindoria.app',
  appName: 'tindoria-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
