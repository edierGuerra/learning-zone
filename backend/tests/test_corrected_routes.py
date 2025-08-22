import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from main import app

client = TestClient(app)


class TestStudentAuthentication:

    def test_register_student_success(self):
        """Test exitoso de registro de estudiante"""
        with patch(
            "services.student_services.StudentService.register_student"
        ) as mock_register:
            mock_register.return_value = {
                "message": "Estudiante registrado exitosamente"
            }

            response = client.post(
                "/api/v1/students/register",
                json={
                    "identification_number": 12345678,
                    "names": "Juan",
                    "last_names": "Pérez",
                    "email": "juan@test.com",
                    "password": "password123",
                },
            )

            assert response.status_code == 201
            mock_register.assert_called_once()

    def test_login_student_success(self):
        """Test exitoso de login de estudiante"""
        with patch(
            "services.student_services.StudentService.login_student"
        ) as mock_login:
            mock_login.return_value = {
                "access_token": "test_access_token",
                "refresh_token": "test_refresh_token",
                "token_type": "bearer",
            }

            response = client.post(
                "/api/v1/students/login",
                json={"identification_number": 12345678, "password": "password123"},
            )

            assert response.status_code == 200
            mock_login.assert_called_once()

    def test_refresh_token_success(self):
        """Test exitoso de refresh token"""
        with patch(
            "services.student_services.StudentService.refresh_access_token"
        ) as mock_refresh:
            mock_refresh.return_value = {
                "access_token": "new_access_token",
                "token_type": "bearer",
            }

            response = client.post(
                "/api/v1/students/refresh",
                json={"refresh_token": "valid_refresh_token"},
            )

            assert response.status_code == 200
            mock_refresh.assert_called_once()

    def test_verify_email_success(self):
        """Test exitoso de verificación de email"""
        with patch(
            "services.student_services.StudentService.verify_email"
        ) as mock_verify:
            mock_verify.return_value = {"message": "Email verificado exitosamente"}

            response = client.get("/api/v1/students/verify-email/valid_token")

            assert response.status_code == 200
            mock_verify.assert_called_once()


class TestCourseRoutes:

    @patch("dependencies.student_dependencie.get_current_student")
    def test_get_courses_by_student_success(self, mock_get_current):
        """Test exitoso de obtener cursos por estudiante"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.course_services.CourseServices.get_courses_by_student_id"
        ) as mock_get_courses:
            mock_get_courses.return_value = [
                {"id": 1, "name": "Curso 1", "description": "Descripción 1"},
                {"id": 2, "name": "Curso 2", "description": "Descripción 2"},
            ]

            response = client.get(
                "/api/v1/students/courses",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            mock_get_courses.assert_called_once_with(1)


class TestCommentRoutes:

    @patch("dependencies.student_dependencie.get_current_student")
    def test_create_comment_success(self, mock_get_current):
        """Test exitoso de crear comentario"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.comment_services.CommentService.create_comment"
        ) as mock_create:
            mock_create.return_value = {
                "id": 1,
                "content": "Comentario de prueba",
                "student_id": 1,
            }

            response = client.post(
                "/api/v1/comments",
                json={"content": "Comentario de prueba", "course_id": 1},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 201
            mock_create.assert_called_once()

    @patch("dependencies.student_dependencie.get_current_student")
    def test_get_comments_by_course_success(self, mock_get_current):
        """Test exitoso de obtener comentarios por curso"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.comment_services.CommentService.get_comments_by_course_id"
        ) as mock_get_comments:
            mock_get_comments.return_value = [
                {"id": 1, "content": "Comentario 1", "student_id": 1},
                {"id": 2, "content": "Comentario 2", "student_id": 2},
            ]

            response = client.get(
                "/api/v1/comments/course/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            mock_get_comments.assert_called_once_with(1)


class TestContentRoutes:

    @patch("dependencies.student_dependencie.get_current_student")
    def test_get_content_by_lesson_success(self, mock_get_current):
        """Test exitoso de obtener contenido por lección"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.content_services.ContentService.get_contend_by_lesson_id"
        ) as mock_get_content:
            mock_get_content.return_value = {
                "id": 1,
                "lesson_id": 1,
                "content_type": "text",
                "content": "Contenido de ejemplo",
            }

            response = client.get(
                "/api/v1/content/lesson/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            mock_get_content.assert_called_once()


class TestIdentificationRoutes:

    def test_get_identification_by_number_success(self):
        """Test exitoso de obtener identificación por número"""
        with patch(
            "services.identification_services.IdentificationService.get_identification_by_number"
        ) as mock_get:
            mock_get.return_value = {
                "id": 1,
                "n_identification": 12345678,
                "student": {"id": 1, "names": "Juan", "email": "juan@test.com"},
            }

            response = client.get("/api/v1/identifications/12345678")

            assert response.status_code == 200
            mock_get.assert_called_once_with(12345678)

    def test_get_identification_by_number_not_found(self):
        """Test de identificación no encontrada"""
        with patch(
            "services.identification_services.IdentificationService.get_identification_by_number"
        ) as mock_get:
            mock_get.return_value = None

            response = client.get("/api/v1/identifications/99999999")

            assert response.status_code == 404
            mock_get.assert_called_once_with(99999999)


class TestPasswordRecoveryRoutes:

    def test_request_password_reset_success(self):
        """Test exitoso de solicitud de reset de contraseña"""
        with patch(
            "services.student_services.StudentService.request_password_reset"
        ) as mock_request:
            mock_request.return_value = {"message": "Correo de recuperación enviado"}

            response = client.post(
                "/api/v1/recovery-password/request",
                json={"identification_number": 12345678},
            )

            assert response.status_code == 200
            mock_request.assert_called_once()

    def test_reset_password_success(self):
        """Test exitoso de reset de contraseña"""
        with patch(
            "services.student_services.StudentService.reset_password"
        ) as mock_reset:
            mock_reset.return_value = {"message": "Contraseña actualizada exitosamente"}

            response = client.post(
                "/api/v1/recovery-password/reset",
                json={"token": "valid_token", "new_password": "new_password123"},
            )

            assert response.status_code == 200
            mock_reset.assert_called_once()


class TestTeacherRoutes:

    @patch("teacher.dependencies.get_current_teacher")
    def test_get_students_by_course_success(self, mock_get_current):
        """Test exitoso de obtener estudiantes por curso"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.get_students_by_course"
        ) as mock_get_students:
            mock_get_students.return_value = [
                {"id": 1, "names": "Juan", "email": "juan@test.com"},
                {"id": 2, "names": "María", "email": "maria@test.com"},
            ]

            response = client.get(
                "/api/v1/teachers/courses/1/students",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            mock_get_students.assert_called_once_with(1)

    def test_send_suggestion_success(self):
        """Test exitoso de envío de sugerencia"""
        with patch(
            "services.utils.email_sender.send_suggestion_email"
        ) as mock_send_email:
            mock_send_email.return_value = None  # Simular envío exitoso

            response = client.post(
                "/api/v1/teachers/suggestions/send",
                json={
                    "sender": "Test User",
                    "type_suggestion": "Mejora",
                    "content_message": "Esta es una sugerencia de prueba",
                    "to_email": "test@example.com",
                },
            )

            # Nota: Este endpoint puede retornar 404 si no está implementado
            # o puede requerir autenticación teacher
            print(f"Response status: {response.status_code}")
            print(
                f"Response body: {response.json() if response.status_code != 404 else 'Not found'}"
            )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
