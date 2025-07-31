
/** Importa hooks de React para manejar estado y parámetros de URL */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/** Importa tipos específicos del dominio docente */
import type {
  TFormDataLesson,
  TEvaluationTeacherSend,
} from "../types/Teacher";

/** Servicios para crear lección y evaluación */
import CreateLessonAPI from "../services/Lesson/CreateLesson.server";
import { CreateEvaluacionAPI } from "../services/Evaluation/CreateEvaluation.server";
import toast from "react-hot-toast";

/** Define los posibles errores del formulario */
type FormErrors = {
  lesson?: {
    name?: string;
    content?: {
      file?: string;
    };
  };
  evaluation?: {
    question?: string;
    options?: string;
    correctAnswer?: string;
  };
};

/** Hook personalizado para manejar la creación de lecciones y evaluaciones */
export function useFormLessons() {
  /** Obtiene el ID del curso desde los parámetros de la ruta */
  const { id_course } = useParams<{ id_course: string }>();
  const navigate = useNavigate(); // dentro del hook

  /** Estado inicial del formulario, sin IDs ya que se generan en backend */
  const [formDataLesson, setFormDataLesson] = useState<{
    lesson: Omit<TFormDataLesson['lesson'], 'idCourse'>;
    evaluation: Omit<TFormDataLesson['evaluation'], 'idLesson' | 'idCourse'>;
  }>({
    lesson: {
      name: "",
      content: {
        contentType: "text",
        file: null,
        text: "",
      },
    },
    evaluation: {
      questionType: "open_question",
      question: "",
      options: [],
      correctAnswer: "",
    },
  });

  /** Estado para manejar errores del formulario */
  const [errors, setErrors] = useState<FormErrors>({});
  /** Bandera para saber si se está enviando el formulario */
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** Bandera para indicar éxito en el envío */
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /** Mensajes estándar de validación */
  const ERROR_MESSAGES = {
    required: (field: string) => `El campo ${field} es obligatorio.`,
    minOptions: "Debes ingresar al menos dos opciones.",
    emptyOption: "No se permiten opciones vacías.",
    invalidAnswer: "Debes seleccionar una respuesta válida.",
  };

  /** Valida todos los campos del formulario antes de enviar */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { name, content } = formDataLesson.lesson;
    const { questionType, question, options, correctAnswer } = formDataLesson.evaluation;

    /** Valida nombre de la lección */
    if (!name.trim()) {
      newErrors.lesson = {
        ...newErrors.lesson,
        name: ERROR_MESSAGES.required("nombre de la lección"),
      };
    }

    /** Valida archivo multimedia */
    if (!content.file) {
      newErrors.lesson = {
        ...newErrors.lesson,
        content: { file: ERROR_MESSAGES.required("archivo multimedia") },
      };
    }

    /** Valida pregunta */
    if (!question.trim()) {
      newErrors.evaluation = {
        ...newErrors.evaluation,
        question: ERROR_MESSAGES.required("pregunta"),
      };
    }

    /** Si es pregunta de selección múltiple, valida opciones */
    if (questionType === "multiple_choice" && Array.isArray(options)) {
      if (options.length < 2) {
        newErrors.evaluation = {
          ...newErrors.evaluation,
          options: ERROR_MESSAGES.minOptions,
        };
      }

      if (options.some((opt) => !opt.trim())) {
        newErrors.evaluation = {
          ...newErrors.evaluation,
          options: ERROR_MESSAGES.emptyOption,
        };
      }

      if (!correctAnswer || !options.includes(correctAnswer)) {
        newErrors.evaluation = {
          ...newErrors.evaluation,
          correctAnswer: ERROR_MESSAGES.invalidAnswer,
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Envía la lección y la evaluación al backend */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const { name, content } = formDataLesson.lesson;

      /** Crea la lección */
      const lessonCreated = await CreateLessonAPI({
        idCourse: Number(id_course),
        name,
        content: {
          contentType: content.contentType,
          text: content.text,
          file: content.file,
        },
      });

      /** Obtiene el ID de la lección recién creada */
      const id_lesson = lessonCreated;
      if (!id_lesson) throw new Error("No se pudo obtener el ID de la lección");

      /** Prepara datos de evaluación */
      const { questionType, question, options, correctAnswer } = formDataLesson.evaluation;

      const evaluationData: TEvaluationTeacherSend = {
        idCourse: Number(id_course),
        idLesson: id_lesson,
        questionType,
        question,
        options: options ?? [],
        ...(questionType === "multiple_choice" ? { correctAnswer } : {}),
      };

      /** Crea la evaluación */
      const createEvaluation = await CreateEvaluacionAPI(evaluationData);

      /** Marca éxito y resetea formulario */
      if(createEvaluation){
          navigate(`/teacher/courses/${id_course}/lessons`);


      }
      setSubmitSuccess(true);
      resetForm();
      toast.success(createEvaluation.message)


      /* Redirijir al curso  */
    } catch (err) {
      console.error("Error al guardar los datos", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Limpia el formulario luego de 3 segundos */
  const resetForm = () => {
    setTimeout(() => {
      setFormDataLesson({
        lesson: {
          name: "",
          content: { contentType: "text", file: null, text: "" },
        },
        evaluation: {
          questionType: "open_question",
          question: "",
          options: [],
          correctAnswer: "",
        },
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  /** Agrega una opción vacía */
  const addOption = () => {
    setFormDataLesson((prev) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        options: [...(prev.evaluation.options ?? []), ""],
      },
    }));
  };

  /** Elimina una opción y resetea respuesta si era la correcta */
  const removeOption = (index: number) => {
    setFormDataLesson((prev) => {
      const opciones = [...(prev.evaluation.options ?? [])];
      const nuevasOpciones = opciones.filter((_, i) => i !== index);
      const esLaCorrecta = opciones[index] === prev.evaluation.correctAnswer;

      return {
        ...prev,
        evaluation: {
          ...prev.evaluation,
          options: nuevasOpciones,
          correctAnswer: esLaCorrecta ? "" : prev.evaluation.correctAnswer,
        },
      };
    });
  };

  /** Actualiza el valor de una opción */
  const updateOption = (index: number, value: string) => {
    setFormDataLesson((prev) => {
      const nuevas = [...(prev.evaluation.options ?? [])];
      const anterior = nuevas[index];
      nuevas[index] = value;

      return {
        ...prev,
        evaluation: {
          ...prev.evaluation,
          options: nuevas,
          correctAnswer:
            prev.evaluation.correctAnswer === anterior ? value : prev.evaluation.correctAnswer,
        },
      };
    });
  };

  /** Cambia el tipo de pregunta */
  const handleQuestionTypeChange = (value: TFormDataLesson['evaluation']['questionType']) => {
    setFormDataLesson((prev) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        questionType: value,
        options: value === "multiple_choice" ? ["", ""] : [],
        correctAnswer: "",
      },
    }));
  };

  /** Cambia el tipo de contenido de la lección */
  const handleContentTypeChange = (value: TFormDataLesson['lesson']['content']['contentType']) => {
    setFormDataLesson((prev) => ({
      ...prev,
      lesson: {
        ...prev.lesson,
        content: {
          ...prev.lesson.content,
          contentType: value,
        },
      },
    }));
  };

  /** Retorna funciones y estados útiles */
  return {
    formDataLesson,
    setFormDataLesson,
    errors,
    isSubmitting,
    submitSuccess,
    handleSubmit,
    addOption,
    removeOption,
    updateOption,
    handleQuestionTypeChange,
    handleContentTypeChange,
  };
}
