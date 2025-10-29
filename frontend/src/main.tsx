import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary';

const NativeWebSocket = window.WebSocket;

async function enableMocking() {
  const { worker } = await import('./mocks/api/browser.ts');

  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: false,
  });

  // WebSocket’leri MSW bypass et
  if (window.WebSocket !== NativeWebSocket) {
    window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
      return new NativeWebSocket(url, protocols as any);
    } as any;
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
});
