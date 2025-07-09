/* import { useEffect } from "react"; */
import AboutInstitucionAndCje from "./components/landing/AboutInstitucionAndCje";
import Carrusel from "./components/landing/Carrusel";
import Features from "./components/landing/Features";
import StepsToRegister from "./components/landing/StepsToRegister";
/* import { useUser } from "../modules/auth/Hooks/useAuth";
import { useNavigationHandler } from "../hooks/useNavigationHandler"; */
export default function LandingPage() {

/*   const handleBtnNavigate = useNavigationHandler()
  const {isLoggedIn} = useUser()
 */
/*     useEffect(() => {
    if (isLoggedIn) {
      handleBtnNavigate('/home')
    }
  }, [handleBtnNavigate, isLoggedIn]); */

  return (
    <div className="container-landing">
      <Carrusel/>
      <Features />
      <StepsToRegister />
      <AboutInstitucionAndCje/>
    </div>
  )
}
