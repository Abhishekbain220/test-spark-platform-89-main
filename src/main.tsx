import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PaymentProvider } from './contexts/PaymentContext.js'
createRoot(document.getElementById("root")!).render(
        <PaymentProvider>
            <App />
        </PaymentProvider>
);
