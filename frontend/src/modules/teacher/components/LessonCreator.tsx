/* Componente principal que maneja la creación de leccion */

/**
 * Este componente representa un formulario unificado para crear una lección.
 * Internamente, ejecuta un flujo de tres servicios:
 * 1. Crear la lección → retorna `id_lesson`.
 * 2. Crear el contenido asociado a esa lección, usando `id_lesson` + `id_course`.
 * 3. Crear la evaluación vinculada, también usando `id_lesson` + `id_course`.
 */

// Estado inicial del formulario con todos los campos necesarios (lección + evaluación)
const [formData, setFormData] = useState<FormData>({})

// Estado para capturar errores de validación en el formulario
const [errors, setErrors] = useState<FormErrors>({})

// Estado para indicar si el formulario se está enviando (loading spinner, deshabilitar botón, etc.)
const [isSubmitting, setIsSubmitting] = useState(false)

// Bandera que indica si la operación fue exitosa (para mostrar mensaje de éxito)
const [submitSuccess, setSubmitSuccess] = useState(false)


const validateForm = (): boolean => {
  // Crea un objeto temporal para almacenar errores
  const newErrors: FormErrors = {}

  // Validaciones de campos obligatorios (lección)

  // Validaciones especiales si el tipo de pregunta es 'cerrada':
  // - mínimo 2 opciones
  // - sin opciones vacías
  // - debe haber una respuesta correcta seleccionada y válida
  ...

  // Setea los errores en el estado y retorna true/false
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
