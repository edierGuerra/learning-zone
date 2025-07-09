import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StudentProvider } from './modules/auth/Context/userProvider';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <StudentProvider> {/* 👈 Esto es obligatorio */}
        <App />
      </StudentProvider>
    </BrowserRouter>
);
