import React, { useEffect, useState } from "react";

// Contexto principal
import { CourseContext } from "./CourseContext";

// Utilidades
import { authStorage } from "../../../shared/Utils/authStorage"; // Módulo que gestiona localStorage (guardar y obtener token/user)

// Servicios
import ContentLessonsAPI from "../services/ContentLessons.server";
import EvaluationLessonsAPI from "../services/EvaluationLesson.server";
import LessonsCourseAPI from "../services/LessonsCourse.server";

// Tipos
import {
  type TContent,
  type TCourse,
  type TCourses,
  type TEvaluation,
  type TLesson,
  type TLessons,
  type TProgressCourses,
} from "../types/Course";
import toast from "react-hot-toast";
import GetCoursesAPI from "../services/GetCourses";
import ProgressCoursesAPI from "../../user/services/GetProgressCourses.server";

// Props que recibe el Provider: los hijos que van dentro del contexto
type Props = {
  children: React.ReactNode;
};

// Provider principal que controla todo lo relacionado con la sesión del estudiante
export const CourseProvider = ({ children }: Props) => {
  const [courses, setCourses] = useState<TCourses>([]);
  const [lessons, setLessons] = useState<TLessons>([]);
  const [progressLessons, setProgressLessons] = useState<TProgressCourses>([]);
  const [currentLesson, setCurrentLesson] = useState<TLesson | null>(null); /* Leccion que se esta haciendo */
  const [progress,setProgress] = useState(0); /* Progreso del curso especifico */
  const [content, setContent] = useState<TContent | null>(null); /* Contenido de la leccion */
  const [evaluation, setEvaluation] = useState<TEvaluation | null>(null); /* Evaluacion de la leccion */

  // Carga inicial: verifica si hay cursos guardados en localStorage
  useEffect(() => {
    const storedCourses = authStorage.getCourses(); // Trae cursos guardado si existe
    const token = authStorage.getToken();
    if (token && storedCourses.length ===0) {
      // Si no existen cursos, ejecutar el servicio que envía el token al backend y obtiene los cursos del estudiante
      const infoCourses = async () => {
        // Accediendo al backend y obteniendo los cursos
        const dataCourses = await GetCoursesAPI();
        // Almacenando los cursos del estudiante en el localStorage
        authStorage.setCourse(dataCourses);
        /* Setear los cursos en el estado */
        setCourses(dataCourses);
      };

      infoCourses();
    }

    // Si hay sesión guardada, se setean los valores
    if (storedCourses) {
      setCourses(storedCourses);
    }
  }, []);
  
      /* Funcion que se encarga de mostrar el porcentaje completo */
    useEffect(() => {
      if (lessons.length === 0) return;
    
      let number = 0;
      lessons.forEach((lesson) => {
        if (lesson.progress_state === 'complete') {
          number += 1;
        }
      });
    
      const porcent = (number / lessons.length) * 100;
      setProgress(porcent);
    }, [lessons]);


  const storageLessons = authStorage.getLessons()
  useEffect(()=>{
    if(storageLessons.length >0){
      setLessons(storageLessons)
    }
  },[])
  /* Funcion que se encarga de solicitar las lecciones de un curso */
  const loadLessonsCourse  = async(idCourse:TCourse['id'])=>{
    try{
        const lessonsRes = await LessonsCourseAPI(idCourse);
        setLessons(lessonsRes) /* Setear las lecciones para poder renderizarlas en el home del curso */
        /* Setear los valores al localstorage */
        authStorage.setLessons(lessonsRes)


    }catch(error){
        console.log(error)
        toast.error('Ups ocurrio un error')
    }
  }
  /* Funcion que carga el contenido de la leccion */
  const loadLessonContent = async (idCourse: TCourse["id"], lesson: TLesson) => {
    try{
        setCurrentLesson(lesson); /* Pasar la leccion, esto permite renderizar la leccion en una card en el home */
        const contentRes = await ContentLessonsAPI({idCourse,idLesson: lesson.id})
        setContent(contentRes) /* Setear el contenido en su estado, listo para ser renderizado */
    }catch(error){
        console.log(error)
        toast.error('Ups no se pudo cargar')
    }
  };

  /* Funcion que carga la evaluacion de la leccion */
  const loadLessonEvaluation = async (idCourse: TCourse["id"], lesson: TLesson) => {
    try{
        setCurrentLesson(lesson); /* Pasar la leccion, esto permite renderizar la evaluacion en la leccion en una card en el home */
        const evaluationRes = await EvaluationLessonsAPI({idCourse,idLesson: lesson.id})
        setEvaluation(evaluationRes) /* Setear la evaluacion  en su estado, listo para ser renderizado */
    }catch(error){
        console.log(error)
        toast.error('Ups no se pudo cargar')
    }
      };
    /* Funcion que carga el progreso */
    const loadProgressLessons = async () => {
        try{
            const progressLessonsRes = await ProgressCoursesAPI()
            setProgressLessons(progressLessonsRes) /* Setear los progreso en su estado, listo para ser renderizado */
        }catch(error){
            console.log(error)
            toast.error('Ups no se pudo cargar')
        }
          };    


  /* Agregar funcion que traiga los porcentajes de todos los cursos para mostrarlo en el profile */

  return (
    // El Provider envuelve toda la app y expone el contexto con los valores globales
    <CourseContext.Provider
      value={{
      // Cursos disponibles (Excel, Word, PowerPoint)
      courses,
      // Lecciones del curso actual cargado
      lessons,
      // Permite modificar las lecciones desde otros componentes (por ejemplo, marcar como completada)
      setLessons,
      // Porcentaje de progreso del curso
      progress,
      // Lección actual que el estudiante está viendo (estado compartido)
      currentLesson,
      // Contenido de la lección actual (texto, video, imagen.)
      content,
      // Evaluación actual de la lección (preguntas)
      evaluation,
      // Función que carga las lecciones de un curso según su id
      loadLessonsCourse,
      // Función que carga el contenido de una lección específica
      loadLessonContent,
      // Función que carga la evaluación de una lección específica
      loadLessonEvaluation,
      progressLessons,
      loadProgressLessons,

      }}
    >
      {/* Solo renderiza la app si ya se hizo la validación inicial de sesión */}
      {children}
    </CourseContext.Provider>
  );
};
