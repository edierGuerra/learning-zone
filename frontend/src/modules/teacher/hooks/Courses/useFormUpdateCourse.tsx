import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { educationalPalettes, type TColorPalette, type TPaletteNames } from "../../../../shared/theme/ColorPalettesCourses";
import type { TCourseTeacherSend } from "../../types/Teacher";
import type { TCourse } from "../../../courses/types/CourseStudent";
import CreateCourseAPI from "../../services/Course/CreateCourse.server";

export function useFormUpdateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: TCourse["category"];
    image: File | null;
    palette: TPaletteNames;
    paletteColors: TColorPalette;
  }>({
    name: "",
    description: "",
    category: "otro", // por defecto
    image: null,
    palette: "vibrantLearning",
    paletteColors: educationalPalettes["vibrantLearning"]
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | File | TColorPalette | TPaletteNames
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      image: file
    }));
  };

  const handlePaletteChange = (paletteName: TPaletteNames) => {
    setFormData((prev) => ({
      ...prev,
      palette: paletteName,
      paletteColors: educationalPalettes[paletteName]
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.description.trim()) newErrors.description = "La descripción es obligatoria";
    if (!formData.category) newErrors.category = "Selecciona una categoría";
    if (!formData.image) newErrors.image = "Debes subir una imagen";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Evita que el formulario recargue la página al hacer submit (comportamiento por defecto del navegador).
    if (!validate()) return;
    // Si la función de validación retorna false (hay errores), se detiene aquí y no se continúa con el envío.
    setIsSubmitting(true);
    // Activa el estado de envío: útil para deshabilitar el botón y mostrar un loader ("Creando..." o "Actualizando...").
    setErrors({});
    // Limpia cualquier error anterior mostrado en pantalla antes de hacer un nuevo intento de envío.
    setSubmitSuccess(false);
    // Resetea el estado de éxito para ocultar cualquier mensaje anterior de "Curso creado exitosamente".


    const courseToSend: TCourseTeacherSend = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      name_palette: formData.palette,
      palette: formData.paletteColors
    };

    try {
      const courseId = await CreateCourseAPI(courseToSend);
      setSubmitSuccess(true);
      toast.success("Curso creado exitosamente");
      navigate(`/teacher/courses/${courseId}`);
    } catch (err) {
      toast.error("Error al crear el curso");
      console.error("CreateCourseAPI Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    submitSuccess,
    handleInputChange,
    handleImageChange,
    handlePaletteChange,
    handleSubmit
  };
}
