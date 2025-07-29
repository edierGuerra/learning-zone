# 🛣️ Sistema de Rutas - Rol de Estudiante

Este archivo resume las rutas disponibles para los estudiantes. Se sigue la misma estructura que el sistema de rutas para maestros.

## 📁 Archivos Relevantes
```
frontend/src/routers/
├── private.tsx            # Rutas protegidas para usuarios autenticados
├── CourseRouter.tsx       # Selector de curso dinámico
└── StudentRoutes.tsx      # (en construcción)
```

---

## 🚀 Rutas Principales

| Ruta | Descripción |
| ---- | ----------- |
| `/home` | Página principal del estudiante |
| `/courses/:courseSlug` | Página de inicio de un curso específico. Ejemplos: `/courses/word`, `/courses/excel` |
| `/contentPage` | Vista de contenido de la lección actual |
| `/evaluationPage` | Evaluación de la lección actual |
| `/comments/:courseId` | Comentarios del curso |
| `/help` | Página de ayuda |

Las rutas de cursos utilizan un parámetro dinámico `courseSlug` que permite agregar nuevos cursos sin modificar la configuración de rutas.

---

## 🔄 Flujo de Navegación
1. El estudiante accede a `/home` y selecciona un curso.
2. Se navega a `/courses/<nombre>` donde `CourseRouter` decide qué componente mostrar.
3. Desde allí se cargan lecciones, contenidos y evaluaciones de forma dinámica.

