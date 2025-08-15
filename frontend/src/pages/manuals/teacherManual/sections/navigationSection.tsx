import '../sections/styles/navigationSection.css'
const NavigationSection = () => (
  <section>
    <h2 className="navigation-section-title">Navegación general</h2>
    <ul className="navigation-list">
      <li><strong>Panel de control</strong>: vista general del sistema.</li>
      <li><strong>Gestión de cursos</strong>: crear, editar o eliminar cursos.</li>
      <li><strong>Gestión de estudiantes</strong>: ver información de estudiantes, progreso y calificaciones.</li>
      <li><strong>Evaluaciones</strong>: crear y revisar evaluaciones.</li>
      <li><strong>Revisión de quejas</strong>: leer y responder sugerencias o reclamos.</li>
      <li><strong>Configuraciones</strong>: personalización de opciones administrativas.</li>
    </ul>
    <p className="page-number">3</p>

  </section>
);
export default NavigationSection;