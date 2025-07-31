# 🛣️ Sistema de Rutas - Rol de Maestro

## 📁 Estructura de Archivos

### Archivos Creados/Modificados:
```
frontend/src/routers/
├── index.tsx              ✅ Modificado
├── private.tsx            ✅ Modificado
├── TeacherRoutes.tsx      ✅ Nuevo
├── RoleGuard.tsx          ✅ Nuevo
└── RoleRedirect.tsx       ✅ Nuevo
```

---

## 🔐 Sistema de Protección por Roles

### **RoleGuard.tsx** - Protección de Rutas
```typescript
// Componentes disponibles:
<TeacherGuard />      // Solo maestros
<StudentGuard />      // Solo estudiantes
```

### **RoleRedirect.tsx** - Redirección Automática
```typescript
// Redirección automática según rol:
- teacher → /teacher/dashboard
- student → /student/courses
```

---

## 🎯 Rutas de Maestro

### **URLs Principales:**
```
/teacher/                    → Dashboard principal
/teacher/dashboard          → Dashboard del maestro
/teacher/courses            → Gestión de cursos
/teacher/students           → Lista de estudiantes
/teacher/notifications      → Centro de notificaciones
```

### **Gestión de Cursos:**
```
/teacher/courses/create     → Crear nuevo curso
/teacher/courses/:courseId  → Editar curso específico
/teacher/courses/:courseId/lessons → Gestionar lecciones
```

### **Creación de Contenido:**
```
/teacher/lessons/create     → Crear lección
/teacher/lessons/:lessonId/edit → Editar lección
/teacher/evaluations/create → Crear evaluación
/teacher/evaluations/:evaluationId/edit → Editar evaluación
```

### **Gestión de Estudiantes:**
```
/teacher/students           → Lista de estudiantes
/teacher/students/:studentId → Perfil del estudiante
/teacher/progress           → Progreso de estudiantes
```
### **Notificaciones:**
```
/teacher/notifications      → Centro de notificaciones
/teacher/notifications/create → Crear notificación
```

### **Configuración:**
```
/teacher/profile            → Perfil del maestro
/teacher/settings           → Configuración
```

---

## 🚀 Flujo de Navegación

### **1. Login del Usuario:**
```
Usuario hace login → Se detecta su rol → Redirección automática
```

### **2. Redirección por Rol:**
```
- Maestro → /teacher/dashboard
- Estudiante → /student/courses
```

### **3. Protección de Rutas:**
```
- Si maestro intenta acceder a /student/* → Redirige a /home
- Si estudiante intenta acceder a /teacher/* → Redirige a /home
- Si no está logueado → Redirige a /
```

---

## 🔧 Implementación Técnica

### **Estructura de Rutas Anidadas:**
```typescript
<Route element={<TeacherGuard />}>
  <Route path="/teacher/*" element={<TeacherRoutes />} />
</Route>
```

### **Componentes de Páginas Requeridos:**
```typescript
// Páginas que necesitas crear:
TeacherDashboard.tsx
CourseManagement.tsx
LessonCreator.tsx
EvaluationCreator.tsx
StudentProgress.tsx
Analytics.tsx
NotificationCenter.tsx
```

### **Hooks Necesarios:**
```typescript
// En useAuth debe incluir:
const { user, role, isLoggedIn, isReady } = useUser();
```

---

## 📋 Próximos Pasos

### **1. Crear Componentes de Páginas:**
- [ ] `TeacherDashboard.tsx`
- [ ] `CourseManagement.tsx`
- [ ] `LessonCreator.tsx`
- [ ] `EvaluationCreator.tsx`
- [ ] `StudentProgress.tsx`
- [ ] `Analytics.tsx`
- [ ] `NotificationCenter.tsx`

### **2. Actualizar Contexto de Usuario:**
- [ ] Agregar campo `role` al contexto
- [ ] Modificar login para incluir rol
- [ ] Actualizar tipos TypeScript

### **3. Implementar Servicios:**
- [ ] `TeacherAuthService`
- [ ] `CourseManagementService`
- [ ] `LessonManagementService`
- [ ] `EvaluationManagementService`

### **4. Crear Hooks Específicos:**
- [ ] `useTeacherAuth`
- [ ] `useCourseManagement`
- [ ] `useAnalytics`

---

## 🎨 Estructura de Carpetas Sugerida

```
frontend/src/modules/teacher/
├── pages/
│   ├── TeacherDashboard.tsx
│   ├── CourseManagement.tsx
│   ├── LessonCreator.tsx
│   ├── EvaluationCreator.tsx
│   ├── StudentProgress.tsx
│   └── NotificationCenter.tsx
├── components/
│   ├── CourseCard.tsx
│   ├── LessonForm.tsx
│   ├── EvaluationForm.tsx
│   └── StudentList.tsx
├── services/
│   ├── TeacherAuth.service.ts
│   ├── CourseManagement.service.ts
├── hooks/
│   ├── useTeacherAuth.ts
│   └── useCourseManagement.ts
└── types/
    └── Teacher.d.ts
```

---

## ⚡ Comandos Útiles

### **Crear estructura de carpetas:**
```bash
mkdir -p frontend/src/modules/teacher/{pages,components,services,hooks,types}
```

### **Crear archivos de páginas:**
```bash
touch frontend/src/modules/teacher/pages/{TeacherDashboard,CourseManagement,LessonCreator,EvaluationCreator,StudentProgress,Analytics,NotificationCenter}.tsx
```

---

## 🔍 Verificación

### **Para probar las rutas:**
1. Asegúrate de que el contexto incluya `role`
2. Haz login como maestro
3. Verifica que redirija a `/teacher/dashboard`
4. Prueba acceder a rutas protegidas
5. Verifica que las rutas de estudiante estén bloqueadas

### **Debugging:**
```typescript
// En RoleGuard.tsx, agrega logs:
console.log('User:', user);
console.log('Role:', role);
console.log('Allowed roles:', allowedRoles);
```

---

## 📝 Notas Importantes

- ✅ **Rutas protegidas**: Solo maestros pueden acceder a `/teacher/*`
- ✅ **Redirección automática**: Al login va directo al dashboard correcto
- ✅ **Rutas anidadas**: Usando `/*` para rutas hijas
- ✅ **Guards reutilizables**: Fácil de extender para nuevos roles
- ⚠️ **Componentes pendientes**: Necesitas crear las páginas referenciadas
- ⚠️ **Contexto pendiente**: Actualizar `useAuth` para incluir `role`
- 🎯 **Solo 2 roles**: Maestro y Estudiante (sin admin)
