import { useParams } from "react-router-dom";
import WordHomePage from "../modules/courses/word/WordHomePage";
import ExcelHomePage from "../modules/courses/excel/ExcelHomePage";
import PowerPointHomePage from "../modules/courses/powerpoint/PowerPointHomePage";

/**
 * CourseRouter selecciona la página correcta según el nombre del curso.
 * Permite añadir nuevos cursos en el futuro utilizando la misma ruta base.
 */
export default function CourseRouter() {
  const { nameCourse } = useParams<{ nameCourse: string }>();
  const name = nameCourse?.toLowerCase();

  switch (name) {
    case "word":
      return <WordHomePage />;
    case "excel":
      return <ExcelHomePage />;
    case "powerpoint":
      return <PowerPointHomePage />;
    default:
      return <div>Curso no disponible</div>;
  }
}
