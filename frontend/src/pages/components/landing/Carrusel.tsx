import './Styles/Carrusel.css'
import imgIcon from '../../assets/Carrusel/img-ier.jpg'
    export default function Carrusel() {
  return (
  <section className='section-carrusel'>
            <h2 className='titulo'>Lz - Juan Tamayo</h2>
            <div className='container-carrusel'>
                <ul>
                    <li>
                        <img src={imgIcon} alt="" />
                        <div className="texto">
                            <h2>¡Estudiantes brillantes!</h2>
                            <p>Hoy más que nunca, los estudiantes tienen habilidades únicas: son curiosos, creativos y aprenden rápido. Este aplicativo fue creado pensando en ustedes, que no temen a los retos y buscan siempre superarse</p>
                        </div>
                    </li>
                    <li>
                        <img src={imgIcon} alt="" />
                        <div className="texto">
                            <h2>Dominan la tecnología</h2>
                            <p>Ustedes han crecido en un mundo digital, y eso los convierte en expertos en adaptarse. Con herramientas como Word, Excel y PowerPoint, podrán mostrar todo su potencial y crear proyectos increíbles.</p>
                        </div>
                    </li>
                    <li>
                        <img src={imgIcon} alt="" />
                        <div className="texto">
                            <h2>Organizados y capaces</h2>
                            <p>Excel no es solo para matemáticas, ¡es para mentes organizadas como la tuya! Te permitirá planear, analizar y tomar decisiones de forma lógica y estructurada. Una habilidad valiosa en cualquier área</p>
                        </div>
                    </li>
                    <li>
                        <img src={imgIcon} alt="" />
                        <div className="texto">
                            <h2>El futuro es de ustedes</h2>
                            <p>Sabemos que tienen talento, energía y grandes sueños. Este aplicativo es solo una herramienta más en su camino al éxito. ¡Sigan aprendiendo, porque ustedes ya están marcando la diferencia!.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
  )
}
