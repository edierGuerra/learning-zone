import HeaderCourse from "../../components/HeaderCourse";
import { FaCheck } from "react-icons/fa";
import { TbLock } from "react-icons/tb";
import { PiPlayLight } from "react-icons/pi";
import "./styles/WordHomePage.css";
import { useCourseContext } from "../../hooks/useCourse";
import { useEffect } from "react";
import { authStorage } from "../../../../shared/Utils/authStorage";

export default function WordHomePage() {
  const {lessons} = useCourseContext()

  useEffect(() => {
    return () => {
      authStorage.removeLessons();
    };
  }, []);
  // 🔧 Genera curvas suaves entre los nodos con Bezier
  function generateSmoothPath(points: { left: number; top: number }[]): string {
    if (points.length < 2) return "";
  
    let d = `M ${points[0].left + 40} ${points[0].top + 40}`; // Comienza desde el centro aproximado
  
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      
      const x0 = p0.left + 40;
      const y0 = p0.top + 40;
      const x1 = p1.left + 40;
      const y1 = p1.top + 40;
  
      const midX = (x0 + x1) / 2;
  
      d += ` C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;
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
  ];

  const visualLessons = lessons.map((lesson, i) => ({
    ...lesson,
    position: lessonsPositions[i],
  }));

  const pathD = generateSmoothPath(lessonsPositions);

  return (
    <div className="container-home-word">
      <HeaderCourse title="Word" />
      <svg
        className="path-svg-word"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={pathD}
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeDasharray="22, 22"  // línea discontinua (6px trazo, 4px espacio)
          strokeOpacity={0.8}
        />
      </svg>

      <div className="container-lessons-word">
        {visualLessons.map((lesson, i) => (
          <div
            key={lesson.id}
            title={lesson.name}
            className={`lessons-word state-word-${lesson.progress_state}`}
            style={{
              top: `${lesson.position.top}px`,
              left: `${lesson.position.left}px`,
              position: "absolute",
            }}
          >
            <button className={`btn-icon-lesson-word word-${lesson.progress_state}`}>
              {lesson.progress_state === "complete" ? (
                <FaCheck />
              ) : lesson.progress_state === "blocked" ? (
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
