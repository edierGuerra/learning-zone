import { useParams } from "react-router-dom";
import WordHomePage from "../modules/courses/word/WordHomePage";
import ExcelHomePage from "../modules/courses/excel/ExcelHomePage";
import PowerPointHomePage from "../modules/courses/powerpoint/PowerPointHomePage";

/**
 * CourseRouter selecciona la página correcta según el nombre del curso.
 * Permite añadir nuevos cursos en el futuro utilizando la misma ruta base.
 */
export default function CourseRouter() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const slug = courseSlug?.toLowerCase();

  switch (slug) {
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
