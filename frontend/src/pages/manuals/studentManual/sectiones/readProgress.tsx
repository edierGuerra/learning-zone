import '../sectiones/styles/readProgress.css'

export const studentProgress = () => {
  return (
    <div className="student-progress-container">
      <h3 className="student-progress-title"> Ver su progreso con rol estudiante</h3>
      <ul className="student-progress-list">
        <li>Ingresa a la sección “Cursos”..</li>
        <li>Selecciona un curso </li>
        <li>Accede a las lecciones disponibles y allí se mostrara su progreso con su respectivo porcentaje.</li>
      </ul>
      <p className="page-number">4</p>

    </div>
  );
};

export default studentProgress;
