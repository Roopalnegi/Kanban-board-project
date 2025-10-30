import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AppThemeProvider from "./AppTheme/Theme.jsx";
import { BrowserRouter } from 'react-router-dom';
import ErrorFallback from './Components/ErrorFallback/ErrorFallback.jsx';
import { ErrorBoundary } from 'react-error-boundary';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <AppThemeProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
             <App/>
          </ErrorBoundary>
        </AppThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
