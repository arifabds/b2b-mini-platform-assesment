import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/common/ErrorBoundary'

const NativeWebSocket = window.WebSocket;

async function enableMocking() {
  const { worker } = await import('./mocks/api/browser.ts');

  await worker.start({
    onUnhandledRequest: 'bypass', 
    quiet: false,
  });

  if (window.WebSocket !== NativeWebSocket) {
    const MSWWebSocket = window.WebSocket;

    window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
      const urlString = url.toString();

      if (urlString.includes('binance.vision') || urlString.includes('binance.com')) {
        return new NativeWebSocket(url, protocols as any);
      }

      return new MSWWebSocket(url, protocols as any);
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
  )
});