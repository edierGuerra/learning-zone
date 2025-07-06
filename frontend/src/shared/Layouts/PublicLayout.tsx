import Header from "../Components/Header";
import Footer from "../Components/Footer";
import './styles/PublicLayout.css'
import SplashCursor from "../animations/SplashCursor";
import { Outlet } from "react-router-dom";


export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header isPublic ={true}/>
       <Outlet/>
      <Footer/>

    </div>
  )
}
