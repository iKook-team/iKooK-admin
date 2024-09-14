import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Close dropdown when clicked outside
 */
window.addEventListener('click', function (e) {
  document.querySelectorAll('.dropdown').forEach(function (dropdown) {
    // @ts-expect-error Property 'open' does not exist on type 'Element'.
    if (!dropdown.contains(e.target)) {
      // @ts-expect-error Property 'open' does not exist on type 'Element'.
      dropdown.open = false;
    }
  });
});
