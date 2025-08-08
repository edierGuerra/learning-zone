import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './modules/auth/Context/userProvider';

// Envolvemos App SOLO con el provider de usuario.
// Los providers de cursos se deben aplicar DENTRO de App, según el rol y la ruta.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
