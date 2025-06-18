import { useNavigate } from "react-router-dom";
type AppRoutes = "/home" | "/login" | "/profile" | "/back";

export const useNavigationHandler = () => {
    const navigate = useNavigate();
    const handleBtnNavigate =(route:AppRoutes)=>{
      return route === '/back'? navigate(-1): navigate(route)
    }

  return handleBtnNavigate
    
}

