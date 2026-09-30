import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress dev WebSocket disconnection messages as instructed by environment constraints
window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason?.message || event.reason || '');
  if (reason.toLowerCase().includes('websocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
