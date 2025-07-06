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
import { useUser } from "../../modules/auth/Hooks/useAuth";
export default function AuthNavbar() {
  const handleBtnNavigate = useNavigationHandler();
  const [viewCategories, setViewCategories] = useState(false);
  const [viewNotifications, setViewNotifications] = useState(false);
  const {logout} = useUser();

  return (
    <div className="auth-navbar">
        <ul className="opc-auth-navbar">
          {/* Categorias (word, powerPoint, Excel) */}
          <button className="icon-auth-navBar icon-home" onClick={()=>{
            handleBtnNavigate('/home')
            setViewNotifications(false);
            setViewCategories(false);

          }}><AiFillHome/></button>
          {/* Categorias (word, powerPoint, Excel) */}
          <button className="icon-auth-navBar icon-categories" onClick={()=>  {
            setViewCategories(!viewCategories)
          if(viewNotifications){
            setViewNotifications(!viewNotifications)
          }}
            
            }><IoBook/></button>
          {/* Ayuda */}
          <button className="icon-auth-navBar icon-help" onClick={()=>{ 
            
            handleBtnNavigate('/help')
            setViewNotifications(false);
            setViewCategories(false);

          }}><BiSolidHelpCircle/></button>
          {/* Bandeja de entrada de notificaciones */}
          <button className="icon-auth-navBar icon-notifications" onClick={()=> 
          {setViewNotifications(!viewNotifications)
            if(viewCategories){
              setViewCategories(!viewCategories)
            } 
          }


          }><IoMdNotifications/></button>
          {/* Btn user Page */}
          <button className="icon-auth-navBar icon-prefix" onClick={()=>{
            handleBtnNavigate('/userPage')
            setViewNotifications(false);
            setViewCategories(false);


          }}><IconPrefixProfile /></button>
          {/* Btn salir */}
          <button className="icon-auth-navBar icon-exit" onClick={()=>logout()}><IoLogOutOutline /></button>
        </ul>
        {viewCategories && <ViewCategories/>}
        {viewNotifications && <ViewNotifications/>}

    </div>
  )
}
