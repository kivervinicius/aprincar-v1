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
registerSW({ immediate: true });
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
