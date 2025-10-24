import { precacheAndRoute } from 'workbox-precaching';

// Injected manifest files will be automatically included here
// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST || []);
