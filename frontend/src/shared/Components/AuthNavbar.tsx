import { BiSolidHelpCircle } from "react-icons/bi";
import { IoMdNotifications } from "react-icons/io";
import { IoBook } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import IconPrefixProfile from "./IconPrefixProfile";
import { IoLogOutOutline } from 'react-icons/io5';
import { useNavigationHandler } from "../../hooks/useNavigationHandler";
import { useState } from "react";
import ViewCategories from "./AuthNavbar/ViewCategories";
import ViewNotifications from "./AuthNavbar/ViewNotifications";
import './styles/AuthNavbar.css'
export default function AuthNavbar() {
  const handleBtnNavigate = useNavigationHandler()
  const [viewCategories, setViewCategories] = useState(false);
  const [viewNotifications, setViewNotifications] = useState(false);


  return (
    <div className="auth-navbar">
        <ul className="opc-auth-navbar">
          {/* Categorias (word, powerPoint, Excel) */}
          <button className="icon-auth-navBar icon-home" onClick={()=>handleBtnNavigate('/home')}><AiFillHome/></button>
          {/* Categorias (word, powerPoint, Excel) */}
          <button className="icon-auth-navBar icon-categories" onClick={()=>  setViewCategories(!viewCategories)}><IoBook/></button>
          {/* Ayuda */}
          <button className="icon-auth-navBar icon-help"><BiSolidHelpCircle/></button>
          {/* Bandeja de entrada de notificaciones */}
          <button className="icon-auth-navBar icon-notifications" onClick={()=> setViewNotifications(!viewNotifications)}><IoMdNotifications/></button>
          {/* Btn user Page */}
          <button className="icon-auth-navBar icon-prefix" onClick={()=>handleBtnNavigate('/userPage')}><IconPrefixProfile /></button>
          {/* Btn salir */}
          <button className="icon-auth-navBar icon-exit" onClick={()=>handleBtnNavigate('/')}><IoLogOutOutline /></button>
        </ul>
        {viewCategories && <ViewCategories/>}
        {viewNotifications && <ViewNotifications/>}
      
    </div>
  )
}
