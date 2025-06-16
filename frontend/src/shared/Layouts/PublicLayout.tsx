import Header from "../Components/Header";
import Footer from "../Components/Footer";
import LandingPage from "../../pages/LandingPage";
import './styles/PublicLayout.css'
import SplashCursor from "../animations/SplashCursor";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <SplashCursor/>
      <Header/>
        <LandingPage/>
      <Footer/>


    
      
    </div>
  )
}
