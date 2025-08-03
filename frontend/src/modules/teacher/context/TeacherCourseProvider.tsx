import React, { useEffect, useState } from "react";

// Contexto principal

// Utilidades
import { authStorage } from "../../../shared/Utils/authStorage"; // Módulo que gestiona localStorage (guardar y obtener token/user)

// Servicios

// Tipos

import toast from "react-hot-toast";
import type { TColorPalette } from "../../../shared/theme/ColorPalettesCourses";
import type { TLessonsTeacher } from "../../courses/types/CourseStudent";
import GetCoursesTeacherAPI from "../services/Course/GetCoursesTeacher.server";
import type { TCoursesTeachers, TCourseTeacherResponse, TFormDataLesson, TLessonTeacherResponse, TLessonTeacherSend } from "../types/Teacher";
import GetLessonTeacherAPI from "../services/Lesson/GetLessonsCourseTeacher.server";
import LoadInfoLessonTeacherAPI from "../services/Lesson/LoadInfoLessonTeacher.server";
import LoadEvaluationLessonAPI from "../services/Evaluation/LoadEvaluationLesson.server";
import { TeacherCourseContext } from "./TeacherCourseContext";
import GetCourseTeacherAPI from "../services/Course/GetCourseTeacher.server";

// Props que recibe el Provider: los hijos que van dentro del contexto
type Props = {
  children: React.ReactNode;
};

// Provider principal que controla todo lo relacionado con la sesión del estudiante
export const TeacherCourseProvider = ({ children }: Props) => {
  const [courses, setCourses] = useState<TCoursesTeachers>([]);
  const [course, setCourse] = useState<TCourseTeacherResponse | null>(null);
  const [lessons, setLessons] = useState<TLessonsTeacher>([]);
  const [formLesson, setFormLesson] = useState<TFormDataLesson | null>(null);
  const [palette, setPalette] = useState<TColorPalette | null>(null);
  // Carga inicial: verifica si hay cursos guardados en localStorage
  useEffect(() => {
    const storedCourses = authStorage.getCoursesTeacher(); // Trae cursos guardado si existe
    const storedCourse = authStorage.getCourseTeacher(); // Trae cursos guardado si existe
    const storedLessons = authStorage.getLessonsTeacher() /* Trae las lecciones guardadas si existen */
    const storedPaletteColors = authStorage.getPaletteColors(); // Trae palette guardado si existe */
    const token = authStorage.getToken();
    if (token && storedCourses.length ===0) {
      // Si no existen cursos, ejecutar el servicio que envía el token al backend y obtiene los cursos del estudiante
      const infoCourses = async () => {
        // Accediendo al backend y obteniendo los cursos
        const dataCourses = await GetCoursesTeacherAPI();
        // Almacenando los cursos del profesor en el localStorage
        authStorage.setCoursesTeacher(dataCourses);
        /* Setear los cursos en el estado */
        setCourses(dataCourses);
      };

      infoCourses();
    }

    // Si hay sesión guardada, se setean los valores
    if (storedPaletteColors) {
      setPalette(storedPaletteColors);
    }
    // Si hay sesión guardada, se setean los valores
    if (storedCourses) {
      setCourses(storedCourses);
    }
    if (storedCourse) {
      setCourse(storedCourse);
    }

    // Si hay sesión guardada, se setean los valores
    if (storedLessons) {
      setLessons(storedLessons);
    }
  }, []);




  const storageLessons = authStorage.getLessonsTeacher()
  useEffect(()=>{
    if(storageLessons!.length >0){
      setLessons(storageLessons!)
    }
  },[])
  /* Funcion que se encarga de solicitar la infor de un curso */
  const loadInfoCourse =async (idCourse:TCourseTeacherResponse['id'])=>{
    const response = await GetCourseTeacherAPI(idCourse)
    /* Setear en el estado */
    setCourse(response)
    /* Setear en el localStorage */
    authStorage.setCourseTeacher(response)



  }
  /* Funcion que se encarga de solicitar las lecciones de un curso */
  const loadLessonsCourse  = async(idCourse:TCourseTeacherResponse['id'])=>{
    try{
        const lessonsRes = await GetLessonTeacherAPI(idCourse);

        setLessons(lessonsRes) /* Setear las lecciones para poder renderizarlas en el home del curso */
        /* Setear los valores al localstorage */
        authStorage.setLessonsTeacher(lessonsRes)


    }catch(error){
        console.log(error)
        toast.error('Ups ocurrio un error')
    }
  }
  /* Funcion que carga todo lo de la leccion */
  const loadLesson = async (idCourse: TCourseTeacherResponse["id"], idLesson: TLessonTeacherResponse['id']) => {
    try{
      /* Logica que trae el contenido de la leccion*/

      const contentLesson = await LoadInfoLessonTeacherAPI({idCourse,idLesson})
      const contentStorage:Omit<TLessonTeacherSend, 'idCourse'>= {
        name:contentLesson.name,
        content:{
          content_type:contentLesson.content.content_type,
          file:contentLesson.content.file,
          text:contentLesson.content.text
       }
      }
      /* Logica que trae la evaluacion */
      const evaluationLesson = await LoadEvaluationLessonAPI({idCourse,idLesson})
      const evaluationStorage ={
            question_type: evaluationLesson.question_type ,
            question: evaluationLesson.question,
            options: evaluationLesson.options,
            correct_answer:evaluationLesson.correct_answer,
      }
      const formDataLesson: TFormDataLesson = {
        lesson: {
          idCourse,
          name: contentStorage.name,
          content: contentStorage.content
        },
        evaluation: evaluationStorage
      };
      /* Setearlo en el estado */
      setFormLesson(formDataLesson)
      /* Setearlo en el localStorage */
      authStorage.setFormLessonInfo(formDataLesson)
      /* Redirigir al page de editar lesson */ /* ENVIAR POR PARAMETRO DE RUTA LOS IDES  */
      /* CARGAR FORM EN RETURN PARA QUE LO USEN DE LA PAGE DE EDITAR LECCION */



    }catch(error){
        console.log(error)
        toast.error('Ups no se pudo cargar')
    }
  };


  return (
    // El Provider envuelve toda la app y expone el contexto con los valores globales
    <TeacherCourseContext.Provider
      value={{
        setCourses,
        courses,
        loadInfoCourse,
        course,
        formLesson,
        lessons,
        loadLessonsCourse,
        loadLesson,
        palette,
        setPalette,

      }}
    >
      {/* Solo renderiza la app si ya se hizo la validación inicial de sesión */}
      {children}
    </TeacherCourseContext.Provider>
  );
};
