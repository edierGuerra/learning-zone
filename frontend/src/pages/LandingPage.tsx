import AboutInstitucionAndCje from "./components/landing/AboutInstitucionAndCje";
import Carrusel from "./components/landing/Carrusel";
import Features from "./components/landing/Features";
import StepsToRegister from "./components/landing/StepsToRegister";
export default function LandingPage() {


  return (
    <div className="container-landing">
      <Carrusel/> 
      <Features />
      <StepsToRegister /> 
      <AboutInstitucionAndCje/>
    </div>
  )
}
