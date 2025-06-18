import Navbar from "./Navbar";
import iconLz from '../../assets/learningZone/icon-learning-zone.jpg'

import './styles/Header.css'
import { useNavigate } from "react-router-dom";
// Componente que renderiza el header comun 
export default function Header() {
  const navigate = useNavigate();
  const handleClick =()=>{
    navigate('/')
  }
  return (
    <header className="header">
      <section className="section-name-img">
        <img onClick={handleClick} className="icon-lz" src={iconLz} alt="Logo learning Zone" />
      </section>
      <h1 className="name-app">Learning <span>Zone</span></h1>
      {/* Condicion si esta autenticado mostrar AuthNavbar o Navbar comun */}
      <Navbar/>
    </header>
  )
}
