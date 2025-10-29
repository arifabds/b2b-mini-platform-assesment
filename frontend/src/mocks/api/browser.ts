import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

declare global {
  interface Window {
    __MSW_DISABLE_WEBSOCKET_MOCK?: boolean;
  }
}
window.__MSW_DISABLE_WEBSOCKET_MOCK = true;

export const worker = setupWorker(...handlers);
