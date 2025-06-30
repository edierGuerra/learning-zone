import { useNavigate } from "react-router-dom";

type AppRoutes =
  | "/"
  | "/register"
  | "/login"
  | "/confirmEmail"
  | "/home"
  | "/userPage"
  | "/back"
  | "/sitePolicies"
  | "/aboutUs"
  | "/aboutInstitution"
  | "/word"
  | "/excel"
  | "/powerPoint"
  | "/help";

export const useNavigationHandler = () => {
  const navigate = useNavigate();

  const handleBtnNavigate = (route: AppRoutes) => {
    if (route === "/back") {
      navigate(-1);
    } else {
      navigate(route, { replace: true }); // ✅ ESTE ES EL CAMBIO CLAVE
    }
  };

  return handleBtnNavigate;
};