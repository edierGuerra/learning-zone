import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  educationalPalettes,
  type TColorPalette,
  type TPaletteNames
} from '../../../../shared/theme/ColorPalettesCourses';

import type { TCourse } from '../../../courses/types/CourseStudent';
import type { TCourseTeacherSend } from '../../types/Teacher';
import CreateCourseAPI from '../../services/Course/CreateCourse.server';

export function useFormCreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: TCourse['category'];
    image: File | null;
    palette: TPaletteNames;
    paletteColors: TColorPalette;
  }>({
    name: '',
    description: '',
    category: 'otro',
    image: null,
    palette: 'vibrantLearning',
    paletteColors: educationalPalettes['vibrantLearning']
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | TPaletteNames | TColorPalette
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaletteChange = (paletteName: TPaletteNames) => {
    const paletteColors = educationalPalettes[paletteName];
    setFormData(prev => ({
      ...prev,
      palette: paletteName,
      paletteColors
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      image: file
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


    const coursesend: TCourseTeacherSend = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      name_palette: formData.palette,
      palette: formData.paletteColors
    };

    try {
      const response = await CreateCourseAPI(coursesend);
      toast.success(`Curso ${coursesend.name} creado exitosamente`);
      setSubmitSuccess(true);
      navigate(`/teacher/courses/${response}`);
    } catch (error) {
      toast.error("Ocurrió un error al crear el curso");
      console.error(error);
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
    handlePaletteChange,
    handleImageChange,
    handleSubmit
  };
}
