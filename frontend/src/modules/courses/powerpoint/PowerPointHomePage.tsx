import HeaderCourse from "../components/HeaderCourse";
import { useEffect, useRef, useState } from "react";
import { authStorage } from "../../../shared/Utils/authStorage";
import toast from "react-hot-toast";
import { PiAirplaneTiltFill } from "react-icons/pi";
import { TbBuildingAirport } from "react-icons/tb";
import { useCourseContext } from "../hooks/useCourse";
import "./PowerPointHomePage.css";
import { FaCheck } from 'react-icons/fa';
import { TbLock } from 'react-icons/tb';
import { PiPlayLight } from 'react-icons/pi';

export default function PowerPointHomePage() {
  const  {lessons,renderContent,loadLessonsCourse} = useCourseContext();
  const courses = authStorage.getCourses()
  const idCourse = courses!.find(course => course.name.toLowerCase() === 'powerpoint')?.id;

  // Estado para la posición y ángulo del icono
  const [carPos, setCarPos] = useState({ x: 0, y: 0, angle: 0 });
  // Referencia al path SVG para calcular posiciones
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
      authStorage.removeLessons();
      authStorage.removeLesson()
      authStorage.removeLessons();
      authStorage.removeContent()
      authStorage.removeEvaluation()
      loadLessonsCourse(idCourse)
  }, []);

  // 🔧 Genera curvas específicas según el índice del nodo destino
  function generateSmoothPath(points: { left: number; top: number }[]): string {
    if (points.length < 2) return "";
    let d = `M ${points[0].left + 8} ${points[0].top + 40}`;
    // Índices de destino para curva C inversa (lecciones 5,8,10,13,16,19)
    const cInversaIdx = [5, 8, 10, 13, 16, 19];
    // Índices de destino para línea recta (segmentos 1,2,3,14,21,22)
    const lineIdx = [1, 2, 3, 14, 21, 22];
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const x0 = p0.left + 8;
      const y0 = p0.top + 40;
      const x1 = p1.left + 8;
      const y1 = p1.top + 40;
      if (lineIdx.includes(i)) {
        // Línea recta
        d += ` L ${x1} ${y1}`;
      } else if (cInversaIdx.includes(i)) {
        // Curva en forma de 'C' inversa
        const c1x = x0;
        const c1y = y0 + (y1 - y0) * 0.5;
        const c2x = x0 + (x1 - x0) * 0.5;
        const c2y = y1;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y1}`;
      } else {
        // Curva en forma de 'C' normal
        const c1x = x0 + (x1 - x0) * 0.5;
        const c1y = y0;
        const c2x = x1;
        const c2y = y0 + (y1 - y0) * 0.5;
        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x1} ${y1}`;
      }
    }
    return d;
  }
  // Puedes ajustar las posiciones para PowerPoint si lo deseas
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
    { top: 1990, left: 840 },
    { top: 2210, left: 1000 }
  ];

  const visualLessons = lessons.map((lesson, i) => ({
    ...lesson,
    position: lessonsPositions[i],
  }));

  const pathD = generateSmoothPath(lessonsPositions);

  // Animación del icono (igual que en ExcelHomePage)
  useEffect(() => {
    if (!pathRef.current) return;
    const inProgressIdx = lessons.findIndex(l => l.progressState === "in_progress");
    const targetIdx = inProgressIdx === -1 ? 0 : inProgressIdx;
    const totalLen = pathRef.current.getTotalLength();
    let targetPointLen = 0;
    if (targetIdx > 0) {
      const targetPos = lessonsPositions[targetIdx];
      let minDist = Infinity;
      for (let l = 0; l <= totalLen; l += 2) {
        const pt = pathRef.current.getPointAtLength(l);
        const dist = Math.hypot(pt.x - (targetPos.left + 8), pt.y - (targetPos.top + 40));
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
        const delta = 2;
        const prev = pathRef.current.getPointAtLength(Math.max(0, len - delta));
        const angle = Math.atan2(point.y - prev.y, point.x - prev.x) * 180 / Math.PI;
        setCarPos({ x: point.x, y: point.y, angle });
      }
      if (tRaw < 1) {
        animFrame = requestAnimationFrame(animateToTarget);
      }
    }
    if (pathRef.current) {
      const point = pathRef.current.getPointAtLength(0);
      setCarPos({ x: point.x, y: point.y, angle: 0 });
    }
    animFrame = requestAnimationFrame(animateToTarget);
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
    // eslint-disable-next-line
  }, [pathD, lessons.map(l => l.progressState).join("")]);

  return (
    <div className="container-home-powerpoint">
      <HeaderCourse title="Power-Point " />
      <svg
        className="path-svg-powerpoint"
        width={1400}
        height={2480}
        viewBox={`0 0 1450 2090`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Carretera: fondo naranja claro */}
        <path
          ref={pathRef}
          d={pathD}
          stroke="#ffeec2"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
          style={{ filter: 'drop-shadow(0px 0px 6px #ff9800)' }}
        />
        {/* Banana al final del path */}
        {pathRef.current && (() => {
          const len = pathRef.current.getTotalLength();
          const pt = pathRef.current.getPointAtLength(len);
          return (
            <g
              style={{
                transform: `translate(${pt.x - 18}px, ${pt.y - 36}px)`,
                transition: "transform 0.2s"
              }}
            >
              <foreignObject width={46} height={46}>
                <div style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TbBuildingAirport size={46} color="#fff" />
                </div>
              </foreignObject>
            </g>
          );
        })()}
        {/* Icono animado (mono) */}
        <g
          style={{
            transform: `translate(${carPos.x - 20}px, ${carPos.y - 15}px) rotate(${carPos.angle}deg)`,
            transformOrigin: "20px 15px",
            transition: "transform 0.1s linear"
          }}
        >
         <foreignObject width={46} height={46}>
            <div style={{ 
              width: 46, 
              height: 46, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <PiAirplaneTiltFill size={46} color="#fff" />
            </div>
          </foreignObject>
        </g>
      </svg>
      <div className="container-lessons-powerpoint">
        {visualLessons.map((lesson, i) => (
          <div
            key={lesson.id}
            title={lesson.name}
            className={`lessons-powerpoint state-powerpoint-${lesson.progressState}`}
            style={{
              top: `${lesson.position.top}px`,
              left: `${lesson.position.left}px`,
              position: "absolute",
            }}
            onClick={() => {
              if (lesson.progressState !== 'blocked') {
                renderContent(lesson.idCourse, lesson)
              } else {
                toast.error('Ups! Debes completar las lecciones anteriores para continuar')
              }
            }}
          >
            <button className={`btn-icon-lesson-powerpoint powerpoint-${lesson.progressState}`}>
              {lesson.progressState === "complete" ? (
                <FaCheck />
              ) : lesson.progressState === "blocked" ? (
                <TbLock />
              ) : (
                <PiPlayLight />
              )}
            </button>
            <span className="span-lesson-powerpoint">{`lección ${i + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
