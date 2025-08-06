"use client"; // Habilita renderizado del lado del cliente (útil en Next.js)

import {
  BookOpen,
  ClipboardCheck,
  Plus,
  Trash2
} from "lucide-react";

import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Alert,
  AlertDescription,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from "../../../shared/Components/ui/index"; // usa alias limpio

import { useEffect } from "react";
import { authStorage } from "../../../shared/Utils/authStorage";
import { useFormUpdateLessons } from "../hooks/useFormUpdateLesson";

export default function LessonEditor() {
  const {
    formDataLesson,
    setFormDataLesson,
    errors,
    submitSuccess,
    isSubmitting,
    handleSubmit,
    addOption,
    removeOption,
    updateOption,
    handleQuestionTypeChange,
    handleContentTypeChange,
    handleChange,
  } = useFormUpdateLessons();

  // Al cargar el componente, intentar rellenar los campos desde localStorage
  useEffect(() => {
    const data = authStorage.getFormLessonInfo();
    if (data) {
      setFormDataLesson(data);
    }
  }, [setFormDataLesson]);

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Crear Contenido Educativo</h1>
          <p>Complete el formulario para crear una nueva lección con su evaluación</p>
        </div>

        {submitSuccess && (
          <Alert>
            <AlertDescription>
              ¡Contenido educativo actualzad exitosamente!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="form">
          <Card>
            <CardHeader>
              <CardTitle>
                <BookOpen /> Datos de la Lección
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Nombre de la Lección *</Label>
                <Input
                  value={formDataLesson.lesson.name}
                  onChange={handleChange("lesson.name")}
                  className={errors.lesson?.name && "input-error"}
                />
                {errors.lesson?.name && <p className="error">{errors.lesson.name}</p>}
              </div>

              <div>
                <Label>Texto Complementario</Label>
                <Textarea
                  value={formDataLesson.lesson.content.text}
                  onChange={handleChange("lesson.content.text")}
                />
              </div>

              <div>
                <Label>Tipo de Contenido *</Label>
                <Select
                  value={formDataLesson.lesson.content.content_type}
                  onValueChange={handleContentTypeChange}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="image">Imagen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contenido *</Label>
                <Input
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormDataLesson((prev) => ({
                      ...prev,
                      lesson: {
                        ...prev.lesson,
                        content: {
                          ...prev.lesson.content,
                          file: e.target.files?.[0] ?? null,
                        },
                      },
                    }))
                  }
                  className={errors.lesson?.content?.file ? "input-error" : ""}
                />

                {errors.lesson?.content?.file && (
                  <p className="error">{errors.lesson.content.file}</p>
                )}

                {formDataLesson.lesson.content.file && (
                  <p>Archivo: {formDataLesson.lesson.content.file.name}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <ClipboardCheck /> Datos de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Pregunta *</Label>
                <Textarea
                  value={formDataLesson.evaluation.question}
                  onChange={handleChange("evaluation.question")}
                  className={errors.evaluation?.question && "input-error"}
                />
                {errors.evaluation?.question && (
                  <p className="error">{errors.evaluation.question}</p>
                )}
              </div>

              <div>
                <Label>Tipo de Pregunta *</Label>
                <Select
                  value={formDataLesson.evaluation.question_type}
                  onValueChange={handleQuestionTypeChange}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open_question">Abierta</SelectItem>
                    <SelectItem value="multiple_choice">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formDataLesson.evaluation.question_type === "multiple_choice" && (
                <div className="options-section">
                  <div className="options-header">
                    <Label>Opciones</Label>
                    <Button type="button" onClick={addOption}>
                      <Plus /> Agregar
                    </Button>
                  </div>

                  {formDataLesson.evaluation.options?.map((opt, idx) => (
                    <div key={idx} className="option-item">
                      <Input
                        value={opt}
                        onChange={(e: { target: { value: string; }; }) => updateOption(idx, e.target.value)}
                      />
                      <Button type="button" onClick={() => removeOption(idx)}>
                        <Trash2 />
                      </Button>
                    </div>
                  ))}

                  {errors.evaluation?.options && <p className="error">{errors.evaluation.options}</p>}

                  <div>
                    <Label>Respuesta Correcta *</Label>
                    <Select
                      value={formDataLesson.evaluation.correct_answer}
                      onValueChange={handleChange("evaluation.correct_answer")}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {formDataLesson.evaluation.options?.map((opt, idx) => (
                          <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.evaluation?.correctAnswer && (
                      <p className="error">{errors.evaluation.correctAnswer}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="form-submit">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Contenido"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
