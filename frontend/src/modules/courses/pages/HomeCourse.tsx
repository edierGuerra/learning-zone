// Componente genérico para mostrar un mapa de lecciones animado para cualquier curso.
// Admite personalización por paleta de colores y calcula dinámicamente la ruta (path) y posiciones de las lecciones.

import HeaderCourse from "../components/HeaderCourse";
import { FaCheck } from "react-icons/fa";
import { TbLock } from "react-icons/tb";
import { PiPlayLight } from "react-icons/pi";
import "../styles/HomeCourse.css";
import { useEffect, useRef, useState } from "react"; // useRef para path, useState para animación del carro
import { authStorage } from "../../../shared/Utils/authStorage";
import toast from "react-hot-toast";
import { Rocket } from 'lucide-react';
import { GiRoundStar } from "react-icons/gi";
import { useStudentCourseContext } from "../hooks/useCourse";
import { useParams } from "react-router-dom";
import { educationalPalettes} from "../../../shared/theme/ColorPalettesCourses";
import type { TCourse } from "../types/CourseStudent";
import '../styles/HomeCourse.css'


const defaultPalette:TCourse['palette'] = educationalPalettes.calmFocus



// Hook que genera posiciones dinámicas para las lecciones en un patrón zigzag.
function useLessonPositions(count: number, width: number, height: number) {
  // spacingX determina cuánto espacio horizontal se deja entre lecciones,
  // evitando división por cero con Math.max.
  const spacingX = width / Math.max(count, 1);
  // spacingY fija la distancia vertical entre lecciones.
  const spacingY = 120;
  // Se crea un arreglo de objetos donde cada uno representa la posición de una lección.
  // Se alterna un zigzag en X y Y para dar dinamismo al camino visual.
  return Array.from({ length: count }, (_, i) => ({
    // Posición horizontal con zigzag cada otra lección.
    left: spacingX * i * 0.8 + 80 + (i % 2 === 0 ? 0 : 40),
    // Posición vertical con desplazamiento alternante para zigzag.
    top: (i + 1) * spacingY + (i % 2 === 0 ? 40 : 0),
  }));
}

// Genera un path SVG con curvas Bézier que conecta todas las lecciones suavemente.
function generateSmoothPath(points: { left: number; top: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].left} ${points[0].top}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    // controlFactor define cuán curva será la línea entre dos puntos.
    const controlFactor = 0.35 + 0.15 * (i % 3);
    // zigzag alterna dirección arriba/abajo para hacer más vistoso el camino.
    const zigzag = (i % 2 === 0 ? 1 : -1) * 60;
    const c1x = p0.left + (p1.left - p0.left) * controlFactor;
    const c1y = p0.top + (p1.top - p0.top) * controlFactor + zigzag;
    const c2x = p1.left - (p1.left - p0.left) * controlFactor;
    const c2y = p1.top - (p1.top - p0.top) * controlFactor - zigzag;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.left} ${p1.top}`;
  }
  return d;
}

export default function CourseHomePage() {
  const { lessons, renderContent, loadLessonsCourse ,setPalette} = useStudentCourseContext();
  const { id } = useParams();
  const idCourse = Number(id)



  const courses = authStorage.getCoursesStudent();
  /* Obtener la paleta de colores de dicho curso */
 const palette: TCourse['palette'] =
  courses?.find(c => c.id === idCourse)?.palette || defaultPalette;
  /* Setear en el contexto la paleta de colores */
  setPalette(palette)
  const nameCourse: TCourse['name'] | undefined= courses?.find(c => c.id === idCourse!)?.name;


  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 1400, height: 2400 });
  const [carPos, setCarPos] = useState({ x: 0, y: 0, angle: 0 });

  // Observa cambios de tamaño del contenedor para recalcular posiciones de lecciones y el path.
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect;
      setContainerSize({ width: rect.width, height: rect.height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calcula posiciones y path basados en el número de lecciones y tamaño actual.
  const lessonPositions = useLessonPositions(lessons.length, containerSize.width, containerSize.height);
  const pathD = generateSmoothPath(lessonPositions);
  const visualLessons = lessons.map((lesson, i) => ({ ...lesson, position: lessonPositions[i] }));

  // Limpia datos previos y carga lecciones desde backend al montar.
  useEffect(() => {
    authStorage.removeLessonsStudents();
    authStorage.removeLesson();
    authStorage.removeContent();
    authStorage.removeEvaluation();
    if (idCourse) loadLessonsCourse(idCourse);
  }, [idCourse, loadLessonsCourse]);

  // Anima la estrella (carrito) siguiendo el path hasta la lección actual en progreso.
  useEffect(() => {
    if (!pathRef.current) return;
    const inProgressIdx = lessons.findIndex(l => l.progressState === "in_progress");
    const targetIdx = inProgressIdx === -1 ? 0 : inProgressIdx;

    const totalLen = pathRef.current.getTotalLength();
    let targetPointLen = 0;

    // Busca en el path la longitud más cercana a la posición de la lección actual.
    if (targetIdx > 0) {
      const targetPos = lessonPositions[targetIdx];
      let minDist = Infinity;
      for (let l = 0; l <= totalLen; l += 2) {
        const pt = pathRef.current.getPointAtLength(l);
        const dist = Math.hypot(pt.x - targetPos.left, pt.y - targetPos.top);
        if (dist < minDist) {
          minDist = dist;
          targetPointLen = l;
        }
      }
    }

    let animFrame: number | undefined;
    let start: number | null = null;
    const from = 0;
    const duration = 4000; // duración de la animación en ms

    // Función de suavizado para movimiento más natural.
    function easeInOutCubic(x: number) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function animateToTarget(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const tRaw = Math.min(1, elapsed / duration);
      const t = easeInOutCubic(tRaw);
      const len = from + (targetPointLen - from) * t;

      if (pathRef.current) {
        const point = pathRef.current.getPointAtLength(len);
        const prev = pathRef.current.getPointAtLength(Math.max(0, len - 2));
        const angle = Math.atan2(point.y - prev.y, point.x - prev.x) * (180 / Math.PI);
        setCarPos({ x: point.x, y: point.y, angle });
      }
      if (tRaw < 1) animFrame = requestAnimationFrame(animateToTarget);
    }

    // Coloca la estrella al inicio antes de animar.
    if (pathRef.current) {
      const point = pathRef.current.getPointAtLength(0);
      setCarPos({ x: point.x, y: point.y, angle: 0 });
    }

    animFrame = requestAnimationFrame(animateToTarget);
    return () => {
        if (animFrame) {
            cancelAnimationFrame(animFrame);
        }
};
  }, [pathD, lessons.map(l => l.progressState).join("")]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[2400px] overflow-hidden"
      style={{ backgroundColor: palette.surface, color: palette.text }}
    >
      <HeaderCourse key={idCourse} title={nameCourse!} idCourse={idCourse} />

      {/* SVG que dibuja el camino del curso */}
      <svg className="absolute top-0 left-0" width={containerSize.width} height={containerSize.height}>
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
        {/* Icono de meta (cohete) al final del recorrido */}
        {pathRef.current && (() => {
          const len = pathRef.current.getTotalLength();
          const pt = pathRef.current.getPointAtLength(len);
          return (
            <g style={{ transform: `translate(${pt.x - 18}px, ${pt.y - 36}px)` }}>
              <foreignObject width={36} height={36}>
                <div className="flex items-center justify-center w-9 h-9">
                  <Rocket size={47} color={palette.accent} />
                </div>
              </foreignObject>
            </g>
          );
        })()}
        {/* Estrella que se mueve siguiendo el path */}
        <g
          style={{
            transform: `translate(${carPos.x - 20}px, ${carPos.y - 15}px) rotate(${carPos.angle}deg)`,
            transformOrigin: "20px 15px",
            transition: "transform 0.1s linear",
          }}
        >
          <foreignObject width={40} height={30}>
            <div className="flex items-center justify-center w-10 h-7">
              <GiRoundStar size={32} color={palette.accent} />
            </div>
          </foreignObject>
        </g>
      </svg>

      {/* Renderiza visualmente cada lección en su posición calculada */}
      {visualLessons.map((lesson, i) => (
        <div
          key={lesson.id}
          title={lesson.name}
          className="absolute flex flex-col items-center cursor-pointer"
          style={{ top: lesson.position.top, left: lesson.position.left }}
          onClick={() => {
            if (lesson.progressState !== "blocked") {
              renderContent(lesson.idCourse, lesson);
            } else {
              toast.error("Debes completar las lecciones anteriores para continuar");
            }
          }}
        >
          <button
            style={{
              backgroundColor:
                lesson.progressState === "complete"
                  ? palette.brand
                  : palette.surface,
              color: palette.text,
              border:
                lesson.progressState === "in_progress"
                  ? `2px solid ${palette.accent}`    // Borde visible para "en progreso"
                  : lesson.progressState === "blocked"
                  ? `1px solid ${palette.text}55`   // Borde semitransparente para bloqueadas
                  : "none",
              opacity:
                lesson.progressState === "blocked" ? 0.7 : 1,  // Sutil transparencia en bloqueadas
            }}
          >
            {lesson.progressState === "complete" ? (
              <FaCheck />
            ) : lesson.progressState === "blocked" ? (
              <TbLock />
            ) : (
              <PiPlayLight />
            )}
          </button>
          <span className="mt-2 text-sm">{`Lección ${i + 1}`}</span>
        </div>
      ))}
    </div>
  );
}
