import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/index.css';

async function enableMocks() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return;
  const { worker } = await import('@/test/msw/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocks().then(() => {
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('#root not found');
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
