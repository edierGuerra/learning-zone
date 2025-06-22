import { useNavigate } from "react-router-dom";
type AppRoutes =  "/" | "/register" | "/login"  |  "/confirmEmail" |"/home"  | "/profile" | "/back" | "/sitePolicies" | "/aboutUs" | "/aboutInstitution" ;

export const useNavigationHandler = () => {
    const navigate = useNavigate();
    const handleBtnNavigate =(route:AppRoutes)=>{
      return route === '/back'? navigate(-1): navigate(route)
    }

  return handleBtnNavigate
    
}

