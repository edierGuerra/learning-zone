import '../help/styles/Help.css';
import HelpButtons from './HelpButtonsTeacher';
import Home from '../../../modules/teacher/pages/TeacherHome';
import image1 from '../../assets/Help/logo.png';
import image2 from '../../assets/Help/cursos.png';
import image3 from '../../assets/Help/notificaciones.png';
import image4 from '../../assets/Help/perfil.png';
import image5 from '../../assets/Help/ayuda.png';
import image6 from '../../assets/Help/footer.png';
import image7 from '../../assets/Help/cursos2.png';
import image8 from '../../assets/Help/cursos2.png';
import image9 from '../../assets/Help/cursos2.png';

type HelpSlideProps = {
    index: number;// Paso actual en la guía
    setIndex: (i: number) => void; // Función para cambiar el paso
    onSkip: () => void; // Función para saltar toda la guía
};

export default function HelpSlide({ index, setIndex, onSkip }: HelpSlideProps) {
    const helpSteps = [
        {
            text: "LOGO REPRESENTATIVO.",
            image: image1,
        },
        {
            text: "APARTADO DE CATEGORÍA EN DONDE ESTÁN LOS CURSOS...",
            image: image2,
        },
        {
            text: "APARTADO DE NOTIFICACIONES: INFORMACIÓN IMPORTANTE.",
            image: image3,
        },
        {
            text: "PERFIL: EDICIÓN DE INFORMACIÓN.",
            image: image4,
        },
        {
            text: "ÍCONO DE AYUDAS.",
            image: image5,
        },
        {
            text: "FOOTER.",
            image: image6,
        },
        {
            text: "CURSOS DISPONIBLES QUE ESTARÁN COMPUESTOS POR LECCIONES.",
            image: image7,
        },
        {
            text: "BOTON QUE TE ENVIARA A UN FORMULARIO PARA CREAR UN CURSO NUEVO",
            image: image8,
        },
        {
            text: "APARTADO QUE SERÁ EL ESPACIO DEL ADMINISTRADOR ",
            image: image9,
        },
    ];
      // Obtiene el paso actual según el índice recibido por props.
    const currentStep = helpSteps[index];
      // Renderizado del componente
    return (
        <div style={{ position: 'relative', width: '100%', height: '112vh' }}>
            {/* Fondo borroso */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                    filter: 'blur(1.5px)',
                    pointerEvents: 'none',
                }}

            >
                 {/* Aquí se renderiza la página Home como fondo */}
                <Home />
            </div>

            {/* Ayuda */}
            <div className="help-slide" >
                <div className="help-overlay">
                    <div className="help-box">
                        <p className="help-text">{currentStep.text}</p>

                        {currentStep.image && (
                            <img
                                src={currentStep.image}
                                alt="Imagen explicativa"
                                className="help-image"

                            />
                        )}
                        <br></br>
                        {/* Botones de navegación de la ayuda */}
                        <HelpButtons
                            isLast={index === helpSteps.length - 1} // Indica si este es el último paso.
                            onNext={() => setIndex(index + 1)}    // Avanza al siguiente paso.
                            onSkip={onSkip}    // Ejecuta la acción de saltar la guía.
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
