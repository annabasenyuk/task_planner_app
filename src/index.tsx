import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter basename="/list_users_app">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
