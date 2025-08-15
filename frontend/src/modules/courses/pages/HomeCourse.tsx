// Componente genérico para mostrar un mapa de lecciones animado para cualquier curso con estilos aplicados
import HeaderCourse from "../components/HeaderCourse";
import { FaCheck } from "react-icons/fa";
import { TbLock } from "react-icons/tb";
import { PiPlayLight } from "react-icons/pi";
import "../styles/HomeCourse.css";
import { useEffect, useRef, useState } from "react";
import { authStorage } from "../../../shared/Utils/authStorage";
import toast from "react-hot-toast";
import { useStudentCourseContext } from "../hooks/useCourse";
import { useParams } from "react-router-dom";
import { educationalPalettes } from "../../../shared/theme/ColorPalettesCourses";
import type { TCourse } from "../types/CourseStudent";

const defaultPalette: TCourse["palette"] = educationalPalettes.calmFocus;

// 📌 Posiciones en porcentaje respecto al tamaño del SVG
const lessonsPositions = [
  { top: 8, left: 12 },
  { top: 12, left: 26 },
  { top: 9, left: 41 },
  { top: 7, left: 60 },
  { top: 15, left: 77 },
  { top: 23, left: 64 },
  { top: 22, left: 48 },
  { top: 29, left: 28 },
  { top: 36, left: 53 },
  { top: 43, left: 72 },
  { top: 50, left: 53 },
  { top: 48, left: 31 },
  { top: 54, left: 14 },
  { top: 65, left: 33 },
  { top: 62, left: 50 },
  { top: 69, left: 68 },
  { top: 82, left: 50 },
  { top: 80, left: 28 },
  { top: 89, left: 14 },
  { top: 99, left: 35 },
  { top: 98, left: 55 },
  { top: 95, left: 76 },
];

// 📌 Generar path suave (usa valores escala original para que la curva siga bien)
function generateSmoothPath(points: { left: number; top: number }[]): string {
  if (points.length < 2) return "";
  // Pasamos porcentajes a la escala del SVG (1450x2090)
  const scaleX = 1450 / 100;
  const scaleY = 2090 / 100;
  let d = `M ${points[0].left * scaleX} ${points[0].top * scaleY}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = { x: points[i - 1].left * scaleX, y: points[i - 1].top * scaleY };
    const p1 = { x: points[i].left * scaleX, y: points[i].top * scaleY };
    const controlFactor = 0.35 + 0.15 * (i % 3);
    const zigzag = (i % 2 === 0 ? 1 : -1) * 60;
    const c1x = p0.x + (p1.x - p0.x) * controlFactor;
    const c1y = p0.y + (p1.y - p0.y) * controlFactor + zigzag;
    const c2x = p1.x - (p1.x - p0.x) * controlFactor;
    const c2y = p1.y - (p1.y - p0.y) * controlFactor - zigzag;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function CourseHomePage() {
  const { lessons, renderContent, loadLessonsCourse, setPalette, setLessons } = useStudentCourseContext();
  const { id } = useParams();
  const idCourse = Number(id);

  const [palette, setPaletteState] = useState<TCourse["palette"]>(defaultPalette);
  const [nameCourse, setNameCourse] = useState<TCourse["name"]>('');

  useEffect(() => {
    const courses = authStorage.getCoursesStudent();
    const selectedCourse = courses?.find(c => c.id === idCourse);
    const pal = selectedCourse?.palette || defaultPalette;
    setPalette(pal);
    setPaletteState(pal);
    if (selectedCourse?.name) setNameCourse(selectedCourse.name);
  }, [idCourse]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const pathD = generateSmoothPath(lessonsPositions);
  const visualLessons = lessons.map((lesson, i) => ({ ...lesson, position: lessonsPositions[i] }));

  useEffect(() => {
    const stored = authStorage.getLessonsStudents();
    if (!stored || stored.length === 0) {
      authStorage.removeLesson();
      authStorage.removeContent();
      authStorage.removeEvaluation();
      if (idCourse) loadLessonsCourse(idCourse);
    } else {
      setLessons(stored);
    }
  }, [idCourse]);


  return (
    <div
      ref={containerRef}
      className="container-home-course"
      style={{ backgroundColor: palette.surface, color: palette.text }}
    >
      <HeaderCourse
       key={idCourse} title={nameCourse!} idCourse={idCourse} palette={palette} />

      <svg className="path-svg-course" width={1400}
        height={2480} // <-- AJUSTA ESTE VALOR
        viewBox={`0 0 1450 2090`} // <-- AJUSTA ESTE VALOR
        preserveAspectRatio="xMidYMid meet">
        <path
          ref={pathRef}
          d={pathD}
          stroke={palette.brand}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
          style={{ filter: `drop-shadow(0px 0px 6px ${palette.brand})` }}
        />

      </svg>

        {visualLessons.map((lesson, i) => (
          <div
            key={lesson.id}
            title={lesson.name}
            className="lesson-course"
            style={{
              top: `${lesson.position.top +22}%`,
              left: `${lesson.position.left}%`
            }}
            onClick={() => {
              if (lesson.progressState !== "blocked") {
                renderContent(lesson.idCourse, lesson);
              } else {
                toast.error("Debes completar las lecciones anteriores para continuar");
              }
            }}
          >
            <button
              className={`btn-icon-lesson-course ${
                lesson.progressState === "complete"
                  ? "course-complete"
                  : lesson.progressState === "in_progress"
                  ? "course-in_progress"
                  : lesson.progressState === "blocked"
                  ? "course-blocked"
                  : ""
              }`}
              style={{
                backgroundColor: lesson.progressState === "complete" ? palette.accent : '#1003',
                color: palette.text,
              }}
            >
              {lesson.progressState === "complete" ? <FaCheck /> : lesson.progressState === "blocked" ? <TbLock /> : <PiPlayLight />}
            </button>
            <span className="span-lesson-course">{`Lección ${i + 1}`}</span>
          </div>
        ))}
    </div>
  );
}
