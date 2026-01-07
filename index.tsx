
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Safety check for process to avoid ReferenceError: process is not defined
// This ensures the application doesn't crash if the deployment environment 
// hasn't fully initialized the global process object.
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
