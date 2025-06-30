import { useUser } from "../modules/auth/Hooks/useAuth";
import RoutersPrivates from "./private";
import RoutersPublic from "./public";

export default function AppRouter() {
  const { isLoggedIn, isReady } = useUser(); // ✅ Traes ambos valores del contexto

  // 🧠 Esperar a que la sesión esté cargada
  if (!isReady) {
    return <p>Cargando sesión...</p>; // También puedes poner un spinner si lo deseas
  }

  // 👇 Cuando ya esté todo listo, decide si mostrar rutas públicas o privadas
  return isLoggedIn ? <RoutersPrivates /> : <RoutersPublic />;
}
