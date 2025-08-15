import '../sectiones/styles/faqSectionStudent.css'

export const faqSectionStudent=()=>{
    return(
        <div className="faq-Section-Student-Container">
            <h2 className="faq-title">Preguntas frecuentes</h2>
            <h3 className="faq-subtitle"><strong>¿Olvidé mi contraseña, qué hago?</strong></h3>
            <p className="paragraph">Haz clic en “¿Olvidaste tu contraseña?” en la pantalla de inicio y sigue los pasos para restablecerla.</p>
            <h3 className="faq-subtitle"><strong>¿No puedo ver una lección?</strong></h3>
            <p className="paragraph">Verifica tu conexión a internet. Si el problema persiste, comunícate con soporte técnico.</p>
            <h3 className="faq-subtitle"><strong>¿Mi progreso no se guarda?</strong></h3>
            <p className="paragraph">Asegúrate de hacer clic en "Guardar" o completar cada sección correctamente.</p>
            <p className="page-number">8</p>

        </div>
    )
}

export default faqSectionStudent;