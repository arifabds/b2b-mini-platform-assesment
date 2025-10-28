// Sets up and exports the MSW service worker for the browser.
import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)