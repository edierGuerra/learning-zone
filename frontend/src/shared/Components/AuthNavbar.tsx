// Importación de íconos
import { BiSolidHelpCircle } from "react-icons/bi";
import { IoBook, IoLogOutOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";

// Componentes personalizados
import IconPrefixProfile from "./IconPrefixProfile";
import IconNotifications from "./AuthNavbar/IconNotifications";
import ViewCategories from "./AuthNavbar/ViewCategories";
import NotificationPanel from "../../modules/notifications/components/NotificationPanel";

// Hooks personalizados
import { useNavigationHandler } from "../../hooks/useNavigationHandler";
import { useUser } from "../../modules/auth/Hooks/useAuth";

// Herramientas del sistema
import { useEffect, useRef, useState } from "react";
import { authStorage } from "../Utils/authStorage";

// Estilos
import './styles/AuthNavbar.css';

export default function AuthNavbar() {
  // Hook para redireccionar a otras rutas
  const handleBtnNavigate = useNavigationHandler();

  // Estados locales para mostrar/ocultar paneles
  const [viewCategories, setViewCategories] = useState(false); // Para el panel de categorías
  const [viewNotifications, setViewNotifications] = useState(false); // Para el panel de notificaciones

  // Hook de autenticación con función para cerrar sesión
  const { logout } = useUser();

  // Referencias a los paneles para detectar clics fuera de ellos
  const categoriesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  /**
   * useEffect para cerrar paneles cuando se hace clic fuera de ellos
   */
  useEffect(() => {
    // Esta función se ejecuta cuando se hace clic en cualquier parte del documento
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node; // Nodo del DOM que fue clickeado

      // Si el panel de categorías está abierto y se hizo clic fuera de él, lo cerramos
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(target) &&
        viewCategories
      ) {
        setViewCategories(false);
      }

      // Lo mismo para el panel de notificaciones
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target) &&
        viewNotifications
      ) {
        setViewNotifications(false);
      }
    };

    // Escucha los clics en el documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpieza del listener cuando se desmonta el componente
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [viewCategories, viewNotifications]); // Se vuelve a ejecutar si cambia alguno de los paneles

  return (
    <div className="auth-navbar">
      {/* Barra superior con íconos de navegación */}
      <ul className="opc-auth-navbar">
        {/* Botón de inicio (Home) */}
        <button
          className="icon-auth-navBar icon-home"
          onClick={() => {
            handleBtnNavigate('/redirect');             // Navega al home
            setViewNotifications(false);            // Cierra notificaciones si estaban abiertas
            setViewCategories(false);               // Cierra categorías si estaban abiertas
            authStorage.removeLessonsStudents();            // Limpia datos en localStorage
            authStorage.removeLessonsTeacher();            // Limpia datos en localStorage
          }}
        >
          <AiFillHome />
        </button>

        {/* Botón de categorías */}
        <button
          className="icon-auth-navBar icon-categories"
          onClick={() => {
            setViewCategories(!viewCategories);     // Cambia estado de visibilidad
            if (viewNotifications) {
              setViewNotifications(false);          // Cierra panel de notificaciones si estaba abierto
            }
          }}
        >
          <IoBook />
        </button>

        {/* Botón de ayuda */}
        <button
          className="icon-auth-navBar icon-help"
          onClick={() => {
            handleBtnNavigate('/help');             // Navega a página de ayuda
            setViewNotifications(false);            // Cierra panel de notificaciones
            setViewCategories(false);               // Cierra panel de categorías
          }}
        >
          <BiSolidHelpCircle />
        </button>

        {/* Botón de notificaciones */}
        <button
          className="icon-auth-navBar icon-notifications"
          onClick={() => {
            setViewNotifications(!viewNotifications); // Cambia estado de visibilidad
            if (viewCategories) {
              setViewCategories(false);               // Cierra panel de categorías si estaba abierto
            }
          }}
        >
          <IconNotifications />
        </button>

        {/* Botón de perfil de usuario */}
        <button
          className="icon-auth-navBar icon-prefix"
          onClick={() => {
            handleBtnNavigate('/student/profile-student');           // Navega a página de usuario
            setViewNotifications(false);              // Cierra otros paneles
            setViewCategories(false);
          }}
        >
          <IconPrefixProfile />
        </button>

        {/* Botón para cerrar sesión */}
        <button
          className="icon-auth-navBar icon-exit"
          onClick={() => logout()}                   // Llama a función de logout
        >
          <IoLogOutOutline />
        </button>
      </ul>

      {/* Panel de categorías - se monta solo si está activo */}
      {viewCategories && (
        <div ref={categoriesRef}>
          <ViewCategories />
        </div>
      )}

      {/* Panel de notificaciones - se monta solo si está activo */}
      {viewNotifications && (
        <div ref={notificationsRef}>
          <NotificationPanel />
        </div>
      )}
    </div>
  );
}
