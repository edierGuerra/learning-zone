import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StudentProvider } from './modules/auth/Context/userProvider';
import App from './App';
import { CourseProvider } from './modules/courses/context/CourseProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <StudentProvider> {/* 👈 Esto es obligatorio */}
        <CourseProvider>
          <App />
        </CourseProvider>
      </StudentProvider>
    </BrowserRouter>
);
