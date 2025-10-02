import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Import components based on current path
const currentPath = window.location.pathname;
const urlParams = new URLSearchParams(window.location.search);

let ComponentToRender;

if (currentPath === '/payment') {
  const PaymentPage = React.lazy(() => import('../pages/PaymentPage.jsx'));
  ComponentToRender = PaymentPage;
} else if (currentPath === '/PayConfo') {
  const PayConfo = React.lazy(() => import('../pages/PayConfo.jsx'));
  ComponentToRender = PayConfo;
} else {
  const App = React.lazy(() => import('./App.jsx'));
  ComponentToRender = App;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <ComponentToRender />
    </React.Suspense>
  </React.StrictMode>,
)
