import { useUser } from "../modules/auth/Hooks/useAuth";
import RoutersPrivates from "./private";
import RoutersPublic from "./public";

export default function AppRouter() {
  const { isLoggedIn, isReady, user, role, token } = useUser(); // ✅ Traes todos los valores del contexto

  console.log('🧭 AppRouter - Estado actual:', {
    isReady,
    isLoggedIn,
    hasUser: !!user,
    hasRole: !!role,
    hasToken: !!token,
    role,
    user: user ? { id: user.id, name: user.name, email: user.email } : null
  });

  // 🧠 Esperar a que la sesión esté cargada
  if (!isReady) {
    console.log('⏳ AppRouter - Esperando que la sesión esté lista...');
    return <p>Cargando sesión...</p>; // También puedes poner un spinner si lo deseas
  }

  console.log('🎯 AppRouter - Sesión lista, determinando rutas:', isLoggedIn ? 'PRIVADAS' : 'PÚBLICAS');

  // 👇 Cuando ya esté todo listo, decide si mostrar rutas públicas o privadas
  return isLoggedIn ?
   <RoutersPrivates />

   : <RoutersPublic />;
}
