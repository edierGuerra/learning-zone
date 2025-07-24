import HeaderCourse from "../components/HeaderCourse";
import { FaCheck } from "react-icons/fa";
import { TbLock } from "react-icons/tb";
import { PiPlayLight } from "react-icons/pi";
import "./WordHomePage.css";
import { useCourseContext } from "../hooks/useCourse";
import { useEffect, useRef, useState } from "react"; // useRef para path, useState para animación del carro
import { authStorage } from "../../../shared/Utils/authStorage";
import toast from "react-hot-toast";
import { Rocket } from 'lucide-react';
import { GiRoundStar } from "react-icons/gi";

export default function WordHomePage() {
  const  {lessons,renderContent,loadLessonsCourse} = useCourseContext()
  const courses = authStorage.getCourses()
  const idCourse = courses!.find(course => course.name.toLowerCase() === 'word')?.id;
  
  // Estado para la posición y ángulo del carro
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


  // 🔧 Genera un path SVG que pasa suavemente por todas las lecciones,
  // alternando la intensidad de las curvas y agregando un pequeño zigzag.
  // El path SIEMPRE pasa por cada punto de las lecciones.
  function generateSmoothPath(points: { left: number; top: number }[]): string {
    if (points.length < 2) return "";

    // Comienza en la primera lección
    let d = `M ${points[0].left + 8} ${points[0].top + 40}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];

      // Alterna la intensidad de la curva: 0.35, 0.5, 0.65, etc.
      const controlFactor = 0.35 + 0.15 * (i % 3); // Cambia entre 0.35, 0.5, 0.65

      // Zigzag: alterna la dirección del zigzag en cada segmento
      const zigzag = (i % 2 === 0 ? 1 : -1) * 111; // 24px de zigzag, alternando arriba/abajo

      // Puntos de control para la curva de Bézier
      const c1x = p0.left + 8 + (p1.left - p0.left) * controlFactor;
      const c1y = p0.top + 40 + (p1.top - p0.top) * controlFactor + zigzag;
      const c2x = p1.left + 8 - (p1.left - p0.left) * controlFactor;
      const c2y = p1.top + 40 - (p1.top - p0.top) * controlFactor - zigzag;

      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.left + 8} ${p1.top + 40}`;
    }

    return d;
  }

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
  { top: 890, left: 1050 },   // 10
  { top: 1030, left: 750 },   // 11
  { top: 990, left: 440 },  // 12
  { top: 1120, left: 200 },  // 13
  { top: 1350, left: 480 },  // 14 (1340 + 10)
  { top: 1300, left: 720 },  // 15 (1460 + 10)
  { top: 1440, left: 990 },  // 16 (1580 + 10)
  { top: 1710, left: 720 },  // 17 (1700 + 10)
  { top: 1670, left: 400 },  // 18 (1820 + 10)
  { top: 1850, left: 200 },  // 19 (1940 + 10)
  { top: 2070, left: 520 },  // 20 (2060 + 10)
  { top: 2090, left: 840 },  // 21 (2180 + 10)
  { top: 2210, left: 1100 }   // 22 (2300 + 10)
];



  const visualLessons = lessons.map((lesson, i) => ({
    ...lesson,
    position: lessonsPositions[i],
  }));

  const pathD = generateSmoothPath(lessonsPositions);

  // Animación del carro: avanza hasta la lección en progreso
  useEffect(() => {
      if (!pathRef.current) return;
      // Buscar el índice de la lección en progreso
      const inProgressIdx = lessons.findIndex(l => l.progressState === "in_progress");
      // Si no hay ninguna, poner la estrella al inicio
      const targetIdx = inProgressIdx === -1 ? 0 : inProgressIdx;
      // Calcular la longitud total del path
      const totalLen = pathRef.current.getTotalLength();
      // Buscar la posición del nodo objetivo
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
      // Siempre animar desde el inicio del path
      let animFrame: number | undefined;
      let start: number | null = null;
      const from = 0;
      const duration = 4000; // ms, más lento
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
      // Inicializa la estrella en el inicio del path antes de animar
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
    <div className="container-home-word">
      <HeaderCourse title="Word" />
          <svg
        className="path-svg-word"
        width={1400}
        height={2480} // <-- AJUSTA ESTE VALOR
        viewBox={`0 0 1450 2090`} // <-- AJUSTA ESTE VALOR
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Carretera: fondo gris ancho */}
      <path
        ref={pathRef}
        d={pathD}
        stroke="#00CFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
        style={{
          filter: 'drop-shadow(0px 0px 6px #00CFFF)'
        }}
      />
        {/* Bandera al final del path: */}
        {/* Calculamos la posición final del path usando getTotalLength y getPointAtLength, y colocamos la bandera ahí */}
        {pathRef.current && (() => {
          // Obtener la longitud total del path
          const len = pathRef.current.getTotalLength();
          // Obtener el punto final del path
          const pt = pathRef.current.getPointAtLength(len);
          return (
            <g
              // Posicionamos la bandera centrada sobre el punto final
              style={{
                transform: `translate(${pt.x - 18}px, ${pt.y - 36}px)`,
                transition: "transform 0.2s"
              }}
            >
              {/* foreignObject nos permite renderizar un componente React (ícono) dentro del SVG */}
              <foreignObject width={36} height={336}>
                <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* Bandera amarilla al final del recorrido */}
                  <Rocket size={47} color="#ffcb30" />
                </div>
              </foreignObject>
            </g>
          );
        })()}
        {/* Carro animado: se posiciona según carPos y rota según el ángulo */}
        <g
          style={{
            transform: `translate(${carPos.x - 20}px, ${carPos.y - 15}px) rotate(${carPos.angle}deg)`,
            transformOrigin: "20px 15px",
            transition: "transform 0.1s linear"
          }}
        >
          {/* foreignObject permite renderizar el ícono React dentro del SVG */}
          <foreignObject width={40} height={30}>
            <div style={{ width: 40, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Carro azul animado */}
              <GiRoundStar size={32} color="#ffc235" />
            </div>
          </foreignObject>
        </g>
        </svg>

      <div className="container-lessons-word">
        {visualLessons.map((lesson, i) => (
          <div
            key={lesson.id}
            title={lesson.name}
            className={`lessons-word state-word-${lesson.progressState}`}
            style={{
              top: `${lesson.position.top}px`,
              left: `${lesson.position.left}px`,
              position: "absolute",
            }}
            onClick={()=>{
              if(lesson.progressState !== 'blocked'){
                renderContent(lesson.idCourse, lesson)
              }
              else{
                toast.error('Ups! Debes completar las lecciones anteriores para continuar')
              }

            }}
          >
            <button className={`btn-icon-lesson-word word-${lesson.progressState}`}>
              {lesson.progressState === "complete" ? (
                <FaCheck />
              ) : lesson.progressState === "blocked" ? (
                <TbLock />
              ) : (
                <PiPlayLight />
              )}
            </button>
            <span className="span-lesson-word">{`lección ${i + 1}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
