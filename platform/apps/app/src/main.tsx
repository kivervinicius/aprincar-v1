import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { registerSW } from 'virtual:pwa-register';
import { AppStoreProvider } from './app-store';
import { App } from './App';
import { theme } from './theme';

const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;
let updateServiceWorker: (reloadPage?: boolean) => Promise<void>;

updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateServiceWorker(true);
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    void registration.update();
    window.setInterval(() => void registration.update(), UPDATE_CHECK_INTERVAL_MS);
  },
});

let isRefreshingForNewVersion = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (isRefreshingForNewVersion) return;
  isRefreshingForNewVersion = true;
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </MantineProvider>
  </React.StrictMode>,
);
