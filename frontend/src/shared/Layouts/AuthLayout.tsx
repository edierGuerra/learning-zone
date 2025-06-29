import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
/* import SplashCursor from "../animations/SplashCursor"; */
import './styles/PrivateLayout.css'
import Footer from "../Components/Footer";

export default function AuthLayout() {
  return (
    <div className="private-layout">
      <Header isPublic ={false}/>
       <Outlet/> 
      <Footer/>
      
    </div>
  )
}
