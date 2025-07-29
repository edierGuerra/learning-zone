/**
 * 👨‍🏫 TeacherRoutes.tsx - Rutas Específicas para Maestros
 * 
 * Define todas las rutas que solo pueden acceder los maestros.
 * Protegidas por TeacherGuard en el archivo principal de rutas.
 */

import { Routes, Route } from "react-router-dom";

// Importaciones de páginas de maestro
import TeacherDashboard from "../modules/teacher/pages/TeacherDashboard";
import CourseManagement from "../modules/teacher/pages/CourseManagement";
import LessonCreator from "../modules/teacher/pages/LessonCreator";
import EvaluationCreator from "../modules/teacher/pages/EvaluationCreator";
import StudentProgress from "../modules/teacher/pages/StudentProgress";
import NotificationCenter from "../modules/teacher/pages/NotificationCenter";

// COMPONENTE PRINCIPAL
/**
 * TeacherRoutes - Rutas específicas para maestros
 * 
 * Organiza todas las rutas por categorías:
 * - Dashboard
 * - Gestión de cursos
 * - Creación de contenido
 * - Gestión de estudiantes
 * - Notificaciones
 * - Configuración
 */
export default function TeacherRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/homeTeacher" element={<HomeTeacher />} />
      <Route path="/profileTeacher" element={<TeacherPage/>}/> {/* Perfil del profesor */}
      
      
      {/* Gestión de cursos */}
      <Route path="/courses" element={<CourseManagement />} />
      <Route path="/courses/create" element={<div>Crear nuevo curso</div>} />
      <Route path="/courses/:courseId" element={<div>Editar curso</div>} />
      <Route path="/courses/:courseId/lessons" element={<div>Gestionar lecciones</div>} />
      
      {/* Creación de contenido */}
      <Route path="/lessons/create" element={<LessonCreator />} />
      <Route path="/lessons/:lessonId/edit" element={<div>Editar lección</div>} />
      <Route path="/evaluations/create" element={<EvaluationCreator />} />
      <Route path="/evaluations/:evaluationId/edit" element={<div>Editar evaluación</div>} />
      
      {/* Gestión de estudiantes */}
      <Route path="/students" element={<div>Lista de estudiantes</div>} />
      <Route path="/students/:studentId" element={<div>Perfil del estudiante</div>} />
      <Route path="/progress" element={<StudentProgress />} />
      
      {/* Analytics y reportes */}
 {/*      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<div>Reportes</div>} />
       */}
      {/* Notificaciones */}
      <Route path="/notifications" element={<NotificationCenter />} />
      <Route path="/notifications/create" element={<div>Crear notificación</div>} />
      
      {/* Configuración */}
      <Route path="/profile" element={<div>Perfil del maestro</div>} />
      <Route path="/settings" element={<div>Configuración</div>} />
    </Routes>
  );
}