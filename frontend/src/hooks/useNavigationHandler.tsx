import { useNavigate } from "react-router-dom";

type AppRoutes =
  | "/"
  | "/register"
  | "/login"
  | "/emailNewPassword"
  | "/newPassword"
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
      if (window.history.length > 2) {
        navigate(-1); // Ir una página atrás
      } else {
        navigate("/", { replace: true }); 
      }
    } else {
      navigate(route); 
    }
  };

  return handleBtnNavigate;
};

