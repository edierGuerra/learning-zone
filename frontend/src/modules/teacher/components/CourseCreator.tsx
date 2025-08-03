"use client";

// --------- ICONOS ---------
import { BookOpen } from "lucide-react";

// --------- COMPONENTES UI ---------
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
  AlertDescription
} from "../../../shared/Components/ui/index";

// --------- LÓGICA ---------
import { useFormCreateCourse } from "../hooks/Courses/useFormCreateCourse";
import { COURSE_CATEGORY_LABELS } from "../../../shared/constant/CategoriesCourses";
import { educationalPalettes, type TPaletteNames } from "../../../shared/theme/ColorPalettesCourses";

// --------- COMPONENTE PRINCIPAL ---------
export default function CourseCreator() {
  const {
    formData,
    errors,
    submitSuccess,
    isSubmitting,
    handleInputChange,
    handleImageChange,
    handlePaletteChange,
    handleSubmit
  } = useFormCreateCourse();

  return (
  <div className="container-form-course-teacher">
    <div className="envoltura-form-teacher">
      <div className="header-form-course-teacher">
        <h1 className="title-create-course">Crear Curso</h1>
        <p className="paragraph-create-course">Completa la información del nuevo curso.</p>
      </div>

      {submitSuccess && (
        <Alert>
          <AlertDescription>
            ¡Curso creado exitosamente!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="form-course-teacher">
        <Card>
          <CardHeader>
            <CardTitle>
              <BookOpen /> Datos del Curso
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Nombre */}
            <div>
              <Label>Nombre del Curso *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name && "input-course-error"}
              />
              {errors.name && <p className="text-error-course">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div>
              <Label>Descripción *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={errors.description && "input-course-error"}
              />
              {errors.description && <p className="text-error-course">{errors.description}</p>}
            </div>

            {/* Categoría */}
            <div>
              <Label>Categoría *</Label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={errors.category && "input-course-error"}
              >
                {Object.entries(COURSE_CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.category && <p className="text-error-course">{errors.category}</p>}
            </div>

            {/* Paleta de colores */}
            <div>
              <Label>Paleta de Colores *</Label>
              <div>
                <p>Nombre: {formData.palette}</p>
                <div className="preview-palette-course">
                  <span style={{ backgroundColor: formData.paletteColors.brand }}></span>
                  <span style={{ backgroundColor: formData.paletteColors.surface }}></span>
                  <span style={{ backgroundColor: formData.paletteColors.text }}></span>
                  <span style={{ backgroundColor: formData.paletteColors.accent }}></span>
                </div>
                <div className="select-palette-options-course">
                  {Object.entries(educationalPalettes).map(([name, colors]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handlePaletteChange(name as TPaletteNames)}
                      className={`palette-option-button ${
                        formData.palette === name ? "palette-selected" : ""
                      }`}
                    >
                      <span style={{ backgroundColor: colors.brand }}></span>
                      <span style={{ backgroundColor: colors.surface }}></span>
                      <span style={{ backgroundColor: colors.text }}></span>
                      <span style={{ backgroundColor: colors.accent }}></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div>
              <Label>Imagen del Curso *</Label>
              <Input
                type="file"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="btn-send-form-teacher">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Curso"}
          </Button>
        </div>
      </form>
    </div>
  </div>
  );
}
