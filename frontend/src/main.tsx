import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/common/ErrorBoundary'


async function enableMocking() {
  const { worker } = await import('./mocks/api/browser.ts');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

//Initializes MSW to ensure API mocking is active before the React app renders.
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
});


