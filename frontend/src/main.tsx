import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StudentCourseProvider } from './modules/courses/context/StudentCourseProvider';
import { UserProvider } from './modules/auth/Context/userProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <UserProvider> {/* 👈 Esto es obligatorio */}
        <StudentCourseProvider>
          <App/>
        </StudentCourseProvider>
      </UserProvider>
    </BrowserRouter>
);
