import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StudentProvider } from './modules/auth/Context/userProvider';
import AppRouter from './routers';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <StudentProvider> {/* 👈 Esto es obligatorio */}
        <AppRouter />
      </StudentProvider>
    </BrowserRouter>
);
