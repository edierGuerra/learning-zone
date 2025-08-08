// Componente genérico para mostrar un mapa de lecciones animado para cualquier curso con estilos aplicados

import HeaderCourse from "../components/HeaderCourse";
import { FaCheck } from "react-icons/fa";
import { TbLock } from "react-icons/tb";
import { PiPlayLight } from "react-icons/pi";
import "../styles/HomeCourse.css";
import { useEffect, useRef, useState } from "react";
import { authStorage } from "../../../shared/Utils/authStorage";
import toast from "react-hot-toast";
import { GiRoundStar } from "react-icons/gi";
import { useStudentCourseContext } from "../hooks/useCourse";
import { useParams } from "react-router-dom";
import { educationalPalettes } from "../../../shared/theme/ColorPalettesCourses";
import type { TCourse } from "../types/CourseStudent";

const defaultPalette: TCourse["palette"] = educationalPalettes.calmFocus;

const lessonsPositions = [
  { top: 190, left: 160 },
  { top: 290, left: 360 },
  { top: 210, left: 600 },
  { top: 170, left: 880 },
  { top: 310, left: 1120 },
  { top: 490, left: 930 },
  { top: 470, left: 700 },
  { top: 610, left: 400 },
  { top: 750, left: 770 },
  { top: 890, left: 1050 },
  { top: 1030, left: 750 },
  { top: 990, left: 440 },
  { top: 1120, left: 200 },
  { top: 1350, left: 480 },
  { top: 1300, left: 720 },
  { top: 1440, left: 990 },
  { top: 1710, left: 720 },
  { top: 1670, left: 400 },
  { top: 1850, left: 200 },
  { top: 2070, left: 520 },
  { top: 2090, left: 840 },
  { top: 2210, left: 1100 },
];

function generateSmoothPath(points: { left: number; top: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].left} ${points[0].top}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const controlFactor = 0.35 + 0.15 * (i % 3);
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
  const [carPos, setCarPos] = useState({ x: 0, y: 0, angle: 0 });

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

  useEffect(() => {
    if (!pathRef.current || lessonsPositions.length === 0 || !pathD) return;
    const inProgressIdx = lessons.findIndex(l => l.progressState === "in_progress");
    const targetIdx = inProgressIdx === -1 ? 0 : inProgressIdx;
    const totalLen = pathRef.current.getTotalLength();
    let targetPointLen = 0;

    if (targetIdx > 0) {
      const targetPos = lessonsPositions[targetIdx];
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
    const duration = 4000;

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

    const point = pathRef.current.getPointAtLength(0);
    setCarPos({ x: point.x, y: point.y, angle: 0 });
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
      className="container-home-course"
      style={{ backgroundColor: palette.surface, color: palette.text }}
    >
      <HeaderCourse
       key={idCourse} title={nameCourse!} idCourse={idCourse} />

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
        <g style={{ transform: `translate(${carPos.x - 20}px, ${carPos.y - 15}px) rotate(${carPos.angle}deg)`, transformOrigin: "20px 15px", transition: "transform 0.1s linear" }}>
          <foreignObject width={40} height={30}>
            <div className="flex items-center justify-center w-10 h-7">
              <GiRoundStar size={32} color={palette.accent} />
            </div>
          </foreignObject>
        </g>
      </svg>

      <div className="container-lessons-course">
        {visualLessons.map((lesson, i) => (
          <div
            key={lesson.id}
            title={lesson.name}
            className="lesson-course"
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
                backgroundColor: lesson.progressState === "complete" ? 'yellow' : '#1003',
                color: palette.text,
              }}
            >
              {lesson.progressState === "complete" ? <FaCheck /> : lesson.progressState === "blocked" ? <TbLock /> : <PiPlayLight />}
            </button>
            <span className="span-lesson-course">{`Lección ${i + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
