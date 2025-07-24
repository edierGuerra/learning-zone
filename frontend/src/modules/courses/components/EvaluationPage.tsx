/* Page donde se renderiza la evaluacion de una leccion */

import { useState, useEffect, useRef } from "react"
import { useCourseContext } from "../hooks/useCourse"
import type { TEvaluation, TScore } from "../types/Course"
import { useNavigationHandler } from "../../../hooks/useNavigationHandler";
import { authStorage } from "../../../shared/Utils/authStorage";
import '../styles/EvaluationPage.css'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import SendResponseLessonAPI from "../services/SendResponseLesson.server";
import toast from "react-hot-toast";

export default function EvaluationPage() {
  const { evaluation, currentLesson } = useCourseContext()
  const [response, setResponse] = useState<string>('');
  const [score, setScore] = useState<TScore | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const {loadLessonsCourse} = useCourseContext()
  const handleBtnNavigate = useNavigationHandler()

  // Estado para el score animado
  const [animatedScore, setAnimatedScore] = useState<number | null>(null);
  // Ref para el intervalo
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Efecto para animar el score cuando se abre el modal
  useEffect(() => {
    if (showScoreModal && score) {
      setAnimatedScore(score.oldScore); // Iniciar desde oldScore
      const diff = score.newScore - score.oldScore; //diferencia entre el score nuevo y el score anterior
      const duration = 2000; // 1 segundo
      const steps = 40; // 30 frames
      const increment = diff / steps;
      let current = score.oldScore;
      let count = 0; //contador para el intervalo(pasos)
      intervalRef.current = setInterval(() => {
        count++; //incremento del contador(pasos)
        current += increment; //incremento del score
        if (count >= steps) { //si el contador es mayor o igual a los pasos, se setea el score final
          setAnimatedScore(score.newScore); // Asegura valor final
          if (intervalRef.current) clearInterval(intervalRef.current); //limpiar el intervalo
        } else {
          setAnimatedScore(Number(current.toFixed(2))); //setear el score actual
        }
      }, duration / steps);
    }
    // Limpiar intervalo al cerrar modal
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showScoreModal, score]);

  

  const courses = authStorage.getCourses();
  const nameCourse = courses!.find(course => course.id === currentLesson!.idCourse)?.name?.toLowerCase();
  const routeCourse =
    nameCourse === 'excel'
      ? '/excel'
      : nameCourse === 'word'
      ? '/word'
      : '/powerpoint';

  // Función para manejar la respuesta (opción múltiple o abierta)
  const handleAnswer = async (
    e: React.FormEvent<HTMLFormElement> | null, 
    id:TEvaluation['id'], /* Id de evaluacion */
    response: string, 
    questionType: TEvaluation['questionType'] 
  ) => {
    if (e) e.preventDefault();
    try {
      const idCourse = currentLesson!.idCourse;
      const idLesson = currentLesson!.id;
      const res = await SendResponseLessonAPI({id, idCourse, idLesson, response, questionType }); 
      if (res.status === 200) { 
        /* Conversion de lo que viene del backend, para que quede tipo camelCase */
          const score:TScore ={
          newScore:res.score.new_score,
          oldScore:res.score.old_score,
          date:res.score.date
        } 
        toast.success(res.message); 
        /* Setear en el state el score */
     

        setScore(score);
        /* Habilitar esto para que se muestre la ventana */
        setShowScoreModal(true);
        loadLessonsCourse(idCourse);
        return;
      } 
      /* EN caso de que sea error 400 */
      toast.error(res.message);
      handleBtnNavigate('/contentPage');
    } catch {
      toast.error("Ocurrió un error al enviar la respuesta");
    } 
  }
  /* Funcion que se ejecuta cuando clickea en boton de cerrar */
  const handleBtnClickModalScore =()=>{
    setShowScoreModal(false) /* Cerrar le ventana modal */
    handleBtnNavigate(routeCourse); /* Redirijir a home del curso */

  }

  if (!evaluation) return <div>No hay evaluación</div>;

  return (
    <div className={`container-evaluation-lesson-${nameCourse}`}>
      <button className="btn-back-evaluation" onClick={()=>handleBtnNavigate('/back')}>{<IoArrowBackCircleSharp/>}</button>

      <h2 className={`question-evaluation-${nameCourse}`}>{evaluation.question}</h2>
      {evaluation.questionType === 'multiple_choice' ? (
        <div className="container-options">
          {evaluation.options?.map((option, i) => (
            <button
              className={`option-${nameCourse}`}
              value={option}
              key={i}
              type="button"
              onClick={() => handleAnswer( null,evaluation.id, option, evaluation.questionType )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form className="form-evaluation" onSubmit={(e) => handleAnswer(e, evaluation.id, response, evaluation.questionType)}>
          <input className="input-evaluation"
            type="text"
            value={response}
            placeholder="Escribe tu respuesta aquí..."
            onChange={e => setResponse(e.target.value)}
          />
          <input className="btn-send-evaluation" type="submit" />
        </form>
      )}
      {/* Cuando showScoreModal sea true y score tambien, renderizar */}
    {showScoreModal && score && (
     <div className="score-modal">
        <p className="paragraph-left-top">
          {"Correcto!".split("").map((char, idx) => (
            <span
              key={idx}
              style={{
                animation: showScoreModal ? `fadeInLetter 0.25s ${idx * 0.1}s forwards` : "none",
                opacity: 0, // Oculto por defecto, se muestra con la animación
              }}
              className="animated-correct-letter"
            >
              {char}
            </span>
          ))}
        </p>
       <h2 className="title-window-score-modal">Resultados</h2>
       {/* Animación de score */}
       <div style={{position:'relative', display:'inline-block', marginBottom:'1rem'}}>
         <span style={{color:'#7dff7d', fontWeight:700, fontSize:'2rem'}}>
           {animatedScore !== null ? animatedScore.toFixed(2) : score.oldScore.toFixed(2)}
         </span>
         {/* Badge flotante con la diferencia */}
         <span style={{
           position:'absolute',
           top:'-1.7rem',
           right:'.5rem',
           background:'#43a047',
           color:'#fff',
           borderRadius:'16px',
           padding:'0.2rem 0.7rem',
           fontWeight:600,
           fontSize:'1rem',
           boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
           zIndex:2,
           transition:'opacity 0.3s',
           opacity: animatedScore !== null && animatedScore < score.newScore ? 1 : 0
         }}>
           +{(score.newScore - score.oldScore).toFixed(2)}
         </span>
       </div>
       {/* Mostrar el score final solo cuando termina la animación */}
       {animatedScore !== null && animatedScore >= score.newScore && (
         <p style={{marginTop:'0.5rem'}}>¡Puntaje Acumulado!</p>
       )}
       <p className="date-score">{score.date}</p>
       <button onClick={() => handleBtnClickModalScore()}>Cerrar</button>
     </div>
   )}
    </div>
  )
}

