/* import { useNavigate } from "react-router-dom"; */
import politicImage from '../assets/Privacy/politicss.png';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MainPrivacy } from "../components/information/MainPrivacy";
import { MainTerms } from "../components/information/MainTerms";
import { useState } from "react";
import "./styles/SitePolicies.css"; 

export const GeneralPage =()=> {
  /* const navigate = useNavigate(); */
  const [clickTerms, setClickTerms]= useState(false)
  const [clickPrivacy, setClickPrivacy]= useState(true)

  const handleClickBtnTerms=()=> {
    setClickPrivacy(false)
    setClickTerms(true)

  }
  const handleClickBtnPrivacy=()=> {
    setClickPrivacy(true)
    setClickTerms(false)

  }
    return (
        <div className="container-page-legal">
            <div className="container-sidebar">
                <nav className="section-nav">
                    <ul>
                        <li>
                            {/* Agregar este boton de forma global para que sea reutilizable */}
                            <button className="btn-icon">
                            {<IoArrowBackCircleSharp className="icon-back"/>}
                            </button>
                        </li>
                        <li>
                            <button className="sidebar-button" onClick={handleClickBtnTerms}>Terminos y condiciones</button>
                        </li>
                        <li>
                            <button className="sidebar-button" onClick={handleClickBtnPrivacy}>Politicas y privacidad</button>
                        </li>
                        <img src={politicImage} alt="politicas" className="politicas" />
                      
                    </ul>
                </nav>
                <div className="section-contact">
                    <button className="text-contacts">Presentas inquietudes?</button>
                    <div className="contacts-number">
                        <ul>
                            <li>+57 3105245784</li>
                            <li>+57 3105245784</li>
                        </ul>

                    </div>
                </div>
            </div>
            <div className="container-legal-information">
                {clickPrivacy? <MainPrivacy/> : <MainTerms/>}
            </div>
            
        </div>
    )
}
/* { <button onClick={() => navigate("/")} className="back-button">
      back button
    </button> 
} */