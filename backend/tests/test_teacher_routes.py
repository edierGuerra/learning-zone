import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from io import BytesIO
from main import app

client = TestClient(app)


# Test para rutas de teacher
class TestTeacherRoutes:

    @patch("teacher.routes.get_current_teacher")
    def test_create_course_success(self, mock_get_current):
        """Test exitoso de creación de curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_teacher.names = "Profesor Test"
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.create_course") as mock_create:
            mock_create.return_value = 1

            # Simular archivo de imagen
            file_data = BytesIO(b"fake image data")

            response = client.post(
                "/api/v1/teachers/courses",
                data={
                    "name": "Curso Test",
                    "description": "Descripción test",
                    "category": "programacion",
                    "name_palette": "azul",
                    "palette": '{"primary": "#0000ff"}',
                },
                files={"image": ("test.jpg", file_data, "image/jpeg")},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "Curso creado con exito" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_get_published_courses_success(self, mock_get_current):
        """Test exitoso de obtener cursos publicados del teacher"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_published_courses"
        ) as mock_get_courses:
            mock_get_courses.return_value = [
                {"id": 1, "name": "Curso Test", "is_published": True}
            ]

            response = client.get(
                "/api/v1/teachers/courses/published",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("teacher.routes.get_current_teacher")
    def test_get_course_by_id_success(self, mock_get_current):
        """Test exitoso de obtener curso por ID"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_course_by_id"
        ) as mock_get_course:
            mock_get_course.return_value = {
                "id": 1,
                "name": "Curso Test",
                "description": "Descripción test",
            }

            response = client.get(
                "/api/v1/teachers/courses/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["course"]["id"] == 1

    @patch("teacher.routes.get_current_teacher")
    def test_update_course_success(self, mock_get_current):
        """Test exitoso de actualización de curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        mock_course = Mock()
        mock_course.name = "Curso Original"

        with patch(
            "teacher.service.TeacherServices.get_course_by_id"
        ) as mock_get_course:
            mock_get_course.return_value = mock_course

            with patch("teacher.service.TeacherServices.update_course") as mock_update:
                mock_update.return_value = 1

                response = client.put(
                    "/api/v1/teachers/courses/1",
                    data={"name": "Curso Actualizado"},
                    headers={"Authorization": "Bearer fake_token"},
                )

                assert response.status_code == 200
                assert "actualizado" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_delete_course_success(self, mock_get_current):
        """Test exitoso de eliminación de curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.delete_course") as mock_delete:
            mock_delete.return_value = {"message": "Curso eliminado exitosamente"}

            response = client.delete(
                "/api/v1/teachers/courses/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200

    @patch("teacher.routes.get_current_teacher")
    def test_publish_course_success(self, mock_get_current):
        """Test exitoso de publicación de curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.publish_course") as mock_publish:
            mock_publish.return_value = {"id": 1, "is_published": True}

            response = client.patch(
                "/api/v1/teachers/courses/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200

    @patch("teacher.routes.get_current_teacher")
    def test_get_courses_success(self, mock_get_current):
        """Test exitoso de obtener todos los cursos del teacher"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_teacher.courses = [
            {"id": 1, "name": "Curso 1"},
            {"id": 2, "name": "Curso 2"},
        ]
        mock_get_current.return_value = mock_teacher

        response = client.get(
            "/api/v1/teachers/courses/", headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        assert len(response.json()) == 2

    @patch("teacher.routes.get_current_teacher")
    def test_filter_courses_by_category_success(self, mock_get_current):
        """Test exitoso de filtrar cursos por categoría"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.filter_courses_by_category"
        ) as mock_filter:
            mock_filter.return_value = [
                {"id": 1, "name": "Curso Programming", "category": "programacion"}
            ]

            response = client.get(
                "/api/v1/teachers/courses/category/programacion",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("teacher.routes.get_current_teacher")
    def test_get_teacher_info_success(self, mock_get_current):
        """Test exitoso de obtener información del teacher"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_teacher.names = "Profesor Test"
        mock_teacher.email = "profesor@test.com"
        mock_get_current.return_value = mock_teacher

        response = client.get(
            "/api/v1/teachers/", headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200
        assert response.json()["id"] == 1
        assert response.json()["names"] == "Profesor Test"

    @patch("teacher.routes.get_current_teacher")
    def test_create_lesson_success(self, mock_get_current):
        """Test exitoso de creación de lección"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.create_lesson") as mock_create:
            mock_create.return_value = {
                "id": 1,
                "name": "Lección Test",
                "content": {"type": "text", "data": "Contenido test"},
            }

            response = client.post(
                "/api/v1/teachers/courses/1/lessons",
                data={
                    "name": "Lección Test",
                    "content_type": "text",
                    "text": "Contenido de la lección",
                },
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["id"] == 1

    @patch("teacher.routes.get_current_teacher")
    def test_get_lessons_by_course_success(self, mock_get_current):
        """Test exitoso de obtener lecciones por curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_lessons_by_course"
        ) as mock_get_lessons:
            mock_get_lessons.return_value = [
                {"id": 1, "name": "Lección 1"},
                {"id": 2, "name": "Lección 2"},
            ]

            response = client.get(
                "/api/v1/teachers/courses/1/lessons",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert len(response.json()) == 2

    @patch("teacher.routes.get_current_teacher")
    def test_get_lesson_by_id_success(self, mock_get_current):
        """Test exitoso de obtener lección por ID"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_lesson_by_id"
        ) as mock_get_lesson:
            mock_get_lesson.return_value = {
                "id": 1,
                "name": "Lección Test",
                "content": {"type": "text", "data": "Contenido"},
            }

            response = client.get(
                "/api/v1/teachers/courses/lesson/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["id"] == 1

    @patch("teacher.routes.get_current_teacher")
    def test_update_lesson_success(self, mock_get_current):
        """Test exitoso de actualización de lección"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.update_lesson") as mock_update:
            mock_update.return_value = {"id": 1, "name": "Lección Actualizada"}

            response = client.put(
                "/api/v1/teachers/courses/lesson/1",
                data={"name": "Lección Actualizada"},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["name"] == "Lección Actualizada"

    @patch("teacher.routes.get_current_teacher")
    def test_delete_lesson_success(self, mock_get_current):
        """Test exitoso de eliminación de lección"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        mock_lesson = Mock()
        mock_lesson.id = 1

        with patch(
            "teacher.service.TeacherServices.get_lesson_by_id"
        ) as mock_get_lesson:
            mock_get_lesson.return_value = mock_lesson

            with patch("teacher.service.TeacherServices.delete_lesson") as mock_delete:
                mock_delete.return_value = None

                response = client.delete(
                    "/api/v1/teachers/courses/lesson/1",
                    headers={"Authorization": "Bearer fake_token"},
                )

                assert response.status_code == 200
                assert "eliminada" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_create_evaluation_success(self, mock_get_current):
        """Test exitoso de creación de evaluación"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch("teacher.service.TeacherServices.create_evaluation") as mock_create:
            mock_create.return_value = {
                "id": 1,
                "question": "¿Pregunta test?",
                "question_type": "multiple_choice",
            }

            response = client.post(
                "/api/v1/teachers/courses/1/lessons/1/evaluations",
                json={
                    "question": "¿Pregunta test?",
                    "question_type": "multiple_choice",
                    "options": ["Opción 1", "Opción 2"],
                    "correct_answer": "Opción 1",
                },
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "éxito" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_get_evaluation_success(self, mock_get_current):
        """Test exitoso de obtener evaluación"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_evaluation_by_lesson_id"
        ) as mock_get_eval:
            mock_get_eval.return_value = {
                "id": 1,
                "question": "¿Pregunta test?",
                "question_type": "multiple_choice",
            }

            response = client.get(
                "/api/v1/teachers/courses/1/lessons/1/evaluation",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["id"] == 1

    @patch("teacher.routes.get_current_teacher")
    def test_update_evaluation_success(self, mock_get_current):
        """Test exitoso de actualización de evaluación"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        mock_evaluation = Mock()
        mock_evaluation.id = 1

        with patch(
            "teacher.service.TeacherServices.get_evaluation_by_lesson_id"
        ) as mock_get_eval:
            mock_get_eval.return_value = mock_evaluation

            with patch(
                "teacher.service.TeacherServices.update_evaluation"
            ) as mock_update:
                mock_update.return_value = mock_evaluation

                response = client.put(
                    "/api/v1/teachers/evaluations/1",
                    json={"question": "¿Pregunta actualizada?"},
                    headers={"Authorization": "Bearer fake_token"},
                )

                assert response.status_code == 200
                assert "actualizada" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_create_notification_success(self, mock_get_current):
        """Test exitoso de creación de notificación"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "services.notification_services.NotificationService.create_and_distribuite_notification_to_all"
        ) as mock_create:
            mock_create.return_value = {
                "message": "Notificación creada y distribuida",
                "notification_id": 1,
            }

            response = client.post(
                "/api/v1/teachers/notifications/",
                json={"title": "Notificación Test", "message": "Mensaje de prueba"},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200

    @patch("teacher.routes.get_current_teacher")
    def test_get_notifications_success(self, mock_get_current):
        """Test exitoso de obtener notificaciones del teacher"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_notifications_by_teacher_id"
        ) as mock_get_notifications:
            mock_get_notifications.return_value = [
                {"id": 1, "title": "Notificación 1", "message": "Mensaje 1"}
            ]

            response = client.get(
                "/api/v1/teachers/notifications/",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("teacher.routes.get_current_teacher")
    def test_delete_notification_success(self, mock_get_current):
        """Test exitoso de eliminación de notificación"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.delete_teacher_notification"
        ) as mock_delete:
            mock_delete.return_value = True

            response = client.delete(
                "/api/v1/teachers/notifications/?id_notification=1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "eliminado" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_register_student_identifications_success(self, mock_get_current):
        """Test exitoso de registro de identificaciones de estudiantes"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.register_identifications"
        ) as mock_register:
            mock_register.return_value = {
                "processed": 5,
                "successful": 4,
                "duplicates": 1,
                "errors": 0,
            }

            file_data = BytesIO(b"12345678\n87654321\n")

            response = client.post(
                "/api/v1/teachers/students/identifications",
                files={"file": ("identifications.txt", file_data, "text/plain")},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "procesados" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_authenticate_student_success(self, mock_get_current):
        """Test exitoso de autenticación de estudiante"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        mock_identification = Mock()
        mock_identification.id = 1
        mock_identification.n_identification = 12345678

        with patch("teacher.service.TeacherServices.add_identification") as mock_add:
            mock_add.return_value = mock_identification

            response = client.post(
                "/api/v1/teachers/students/identification",
                json={"n_identification": 12345678},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 201
            assert "registrada exitosamente" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_get_identifications_success(self, mock_get_current):
        """Test exitoso de obtener identificaciones"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_all_identifications"
        ) as mock_get_all:
            mock_get_all.return_value = [
                {"id": 1, "number_identification": 12345678, "status": True}
            ]

            response = client.get(
                "/api/v1/teachers/students/identifications",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("teacher.routes.get_current_teacher")
    def test_get_identification_by_id_success(self, mock_get_current):
        """Test exitoso de obtener identificación por ID"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        mock_identification = Mock()
        mock_identification.id = 1
        mock_identification.n_identification = 12345678

        with patch(
            "teacher.service.TeacherServices.get_identification_by_id"
        ) as mock_get_id:
            mock_get_id.return_value = mock_identification

            with patch(
                "teacher.service.TeacherServices.get_status_student"
            ) as mock_get_status:
                mock_get_status.return_value = True

                response = client.get(
                    "/api/v1/teachers/students/identification/1",
                    headers={"Authorization": "Bearer fake_token"},
                )

                assert response.status_code == 200
                assert response.json()["id"] == 1

    @patch("teacher.routes.get_current_teacher")
    def test_get_identification_by_number_success(self, mock_get_current):
        """Test exitoso de obtener identificación por número"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_identification_by_number"
        ) as mock_get_number:
            mock_get_number.return_value = {
                "id": 1,
                "number_identification": 12345678,
                "status": True,
            }

            response = client.get(
                "/api/v1/teachers/students/identification/by-number/12345678",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["number_identification"] == 12345678

    @patch("teacher.routes.get_current_teacher")
    def test_delete_identifications_success(self, mock_get_current):
        """Test exitoso de eliminación de todas las identificaciones"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.delete_all_identifications"
        ) as mock_delete_all:
            mock_delete_all.return_value = None

            response = client.delete(
                "/api/v1/teachers/students/identifications",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "eliminado" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_delete_identification_by_id_success(self, mock_get_current):
        """Test exitoso de eliminación de identificación por ID"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.delete_identification_by_id"
        ) as mock_delete:
            mock_delete.return_value = None

            response = client.delete(
                "/api/v1/teachers/students/identification/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "eliminado" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_update_identification_by_id_success(self, mock_get_current):
        """Test exitoso de actualización de identificación por ID"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.update_identification_by_id"
        ) as mock_update:
            mock_update.return_value = None

            response = client.put(
                "/api/v1/teachers/students/identification/1",
                json={"new_number_identification": 87654321},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "actualizado" in response.json()["message"]

    @patch("teacher.routes.get_current_teacher")
    def test_get_students_by_course_success(self, mock_get_current):
        """Test exitoso de obtener estudiantes por curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_students_by_course"
        ) as mock_get_students:
            mock_get_students.return_value = [
                {
                    "id": 1,
                    "names": "Juan",
                    "last_names": "Pérez",
                    "email": "juan@test.com",
                }
            ]

            response = client.get(
                "/api/v1/teachers/courses/1/students",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "students" in response.json()
            assert len(response.json()["students"]) == 1

    def test_send_suggestion_success(self):
        """Test exitoso de envío de sugerencia"""
        with patch("services.utils.email_sender.send_suggestion_email") as mock_send:
            mock_send.return_value = None

            response = client.post(
                "/api/v1/teachers/suggestions/send",
                json={
                    "sender": "Usuario Test",
                    "type_suggestion": "Mejora",
                    "content_message": "Sugerencia de prueba",
                    "to_email": "test@example.com",
                },
            )

            assert response.status_code == 200
            assert "enviada correctamente" in response.json()["message"]


if __name__ == "__main__":
    pytest.main([__file__])
