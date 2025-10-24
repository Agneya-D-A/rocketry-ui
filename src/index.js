import React from 'react';
import ReactDOM from 'react-dom/client';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {LinkedList, Node} from './util/LinkedList';

// serviceWorkerRegistration.register();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);