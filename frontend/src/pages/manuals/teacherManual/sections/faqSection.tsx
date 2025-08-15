import '../sections/styles/faqSection.css'
const FAQSection = () => (
  <section>
    <h2 className="FAQ-section-title">Preguntas frecuentes</h2>
    <ul className="FAQ-list">
      <li><strong>¿Cómo actualizo una lección?</strong><br />
      Ve a la sección de cursos, selecciona la lección y haz clic en “Editar contenido”.</li>

      <li><strong>¿Puedo descargar los resultados de los estudiantes?</strong><br />
      Sí, puedes exportar notas en formato Excel desde la sección de “Gestión de estudiantes”.</li>

      <li><strong>¿Cómo cambio mi contraseña?</strong><br />
      En tu perfil, haz clic en “Editar contraseña” y sigue los pasos.</li>
    </ul>
    <p className="page-number">8</p>

  </section>
);

export default FAQSection;