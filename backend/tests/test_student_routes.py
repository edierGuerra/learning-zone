import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from main import app

client = TestClient(app)


# Test para rutas de estudiantes
class TestStudentRoutes:

    def test_register_student_success(self):
        """Test exitoso de registro de estudiante"""
        with patch(
            "services.student_services.StudentService.register_student"
        ) as mock_register:
            mock_register.return_value = {
                "message": "Estudiante registrado exitosamente"
            }

            response = client.post(
                "/api/v1/student/",
                json={
                    "identification_number": 12345678,
                    "names": "Juan",
                    "last_names": "Pérez",
                    "email": "juan@test.com",
                    "password": "password123",
                },
            )

            assert response.status_code == 201
            assert "Estudiante registrado exitosamente" in response.json()["message"]

    def test_login_student_success(self):
        """Test exitoso de login de estudiante"""
        with patch(
            "services.student_services.StudentService.valid_student"
        ) as mock_login:
            mock_login.return_value = Mock(id=1, names="Juan", email="juan@test.com")

            response = client.post(
                "/api/v1/student/login",
                json={"identification_number": 12345678, "password": "password123"},
            )

            assert response.status_code == 200
            assert "access_token" in response.json()

    def test_refresh_token_success(self):
        """Test exitoso de refresh token"""
        with patch(
            "services.student_services.StudentService.refresh_access_token"
        ) as mock_refresh:
            mock_refresh.return_value = {
                "access_token": "new_fake_token",
                "token_type": "bearer",
            }

            response = client.post(
                "/api/v1/students/refresh", json={"refresh_token": "fake_refresh_token"}
            )

            assert response.status_code == 200
            assert "access_token" in response.json()

    def test_verify_email_success(self):
        """Test exitoso de verificación de email"""
        with patch(
            "services.student_services.StudentService.verify_email"
        ) as mock_verify:
            mock_verify.return_value = {"message": "Email verificado exitosamente"}

            response = client.get("/api/v1/student/verify_email?token=fake_token")

            assert response.status_code == 200
            assert "verificado exitosamente" in response.json()["message"]

    @patch("core.security.get_current_student")
    def test_get_student_profile_success(self, mock_get_current):
        """Test exitoso de obtener perfil de estudiante"""
        mock_student = Mock()
        mock_student.id = 1
        mock_student.names = "Juan"
        mock_student.email = "juan@test.com"
        mock_get_current.return_value = mock_student

        response = client.get(
            "/api/v1/student/", headers={"Authorization": "Bearer fake_token"}
        )

        assert response.status_code == 200


# Test para rutas de cursos
class TestCourseRoutes:

    @patch("core.security.get_current_student")
    def test_get_published_courses_success(self, mock_get_current):
        """Test exitoso de obtener cursos publicados"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.course_services.CourseServices.get_courses_by_category"
        ) as mock_get_courses:
            mock_get_courses.return_value = [
                {"id": 1, "name": "Curso Test", "description": "Descripción test"}
            ]

            response = client.get(
                "/api/v1/student/courses/all",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("core.security.get_current_student")
    def test_get_course_by_id_success(self, mock_get_current):
        """Test exitoso de obtener curso por ID"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.course_services.CourseServices.get_courses_by_student_id"
        ) as mock_get_course:
            mock_get_course.return_value = [
                {"id": 1, "name": "Curso Test", "description": "Descripción test"}
            ]

            response = client.get(
                "/api/v1/student/courses/",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list) @ patch(
                "routes.course_routes.get_current_student"
            )

    def test_get_courses_by_student_success(self, mock_get_current):
        """Test exitoso de obtener cursos por estudiante"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.course_services.CourseServices.get_courses_by_student"
        ) as mock_get_courses:
            mock_get_courses.return_value = [
                {"id": 1, "name": "Curso Test", "status": "in_progress"}
            ]

            response = client.get(
                "/api/v1/courses/student",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)


# Test para rutas de lecciones
class TestLessonRoutes:

    @patch("routes.lesson_routes.get_current_student")
    def test_get_lesson_by_id_success(self, mock_get_current):
        """Test exitoso de obtener lección por ID"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.lesson_service.LessonService.get_lesson_by_id"
        ) as mock_get_lesson:
            mock_get_lesson.return_value = {
                "id": 1,
                "name": "Lección Test",
                "content": {"type": "text", "data": "Contenido test"},
            }

            response = client.get(
                "/api/v1/lessons/1", headers={"Authorization": "Bearer fake_token"}
            )

            assert response.status_code == 200
            assert response.json()["id"] == 1


# Test para rutas de evaluaciones
class TestEvaluationRoutes:

    @patch("routes.evaluation_routes.get_current_student")
    def test_get_evaluation_by_lesson_success(self, mock_get_current):
        """Test exitoso de obtener evaluación por lección"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.evaluation_service.EvaluationService.get_evaluation_by_lesson_id"
        ) as mock_get_eval:
            mock_get_eval.return_value = {
                "id": 1,
                "question": "¿Pregunta test?",
                "question_type": "multiple_choice",
            }

            response = client.get(
                "/api/v1/evaluations/lesson/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["id"] == 1

    @patch("routes.evaluation_routes.get_current_student")
    def test_submit_answer_success(self, mock_get_current):
        """Test exitoso de enviar respuesta"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.evaluation_service.EvaluationService.submit_answer"
        ) as mock_submit:
            mock_submit.return_value = {
                "score": 10,
                "is_correct": True,
                "message": "Respuesta correcta",
            }

            response = client.post(
                "/api/v1/evaluations/1/answer",
                json={"answer": "Respuesta test"},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["is_correct"]


# Test para rutas de notificaciones
class TestNotificationRoutes:

    @patch("routes.notifications_routes.get_current_student")
    def test_get_notifications_success(self, mock_get_current):
        """Test exitoso de obtener notificaciones"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.notification_services.NotificationService.get_notifications_by_student_id"
        ) as mock_get_notifications:
            mock_get_notifications.return_value = [
                {"id": 1, "title": "Notificación test", "message": "Mensaje test"}
            ]

            response = client.get(
                "/api/v1/notifications/", headers={"Authorization": "Bearer fake_token"}
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)

    @patch("routes.notifications_routes.get_current_student")
    def test_delete_notification_success(self, mock_get_current):
        """Test exitoso de eliminar notificación"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.notification_services.NotificationService.delete_student_notification"
        ) as mock_delete:
            mock_delete.return_value = True

            response = client.delete(
                "/api/v1/notifications/?id_notification=1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200


# Test para rutas de comentarios
class TestCommentRoutes:

    @patch("routes.comment_routes.get_current_student")
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
                "content": "Comentario test",
                "student_id": 1,
                "course_id": 1,
            }

            response = client.post(
                "/api/v1/comments/",
                json={"content": "Comentario test", "course_id": 1},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 201

    @patch("routes.comment_routes.get_current_student")
    def test_get_comments_by_course_success(self, mock_get_current):
        """Test exitoso de obtener comentarios por curso"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.comment_services.CommentService.get_comments_by_course"
        ) as mock_get_comments:
            mock_get_comments.return_value = [
                {"id": 1, "content": "Comentario test", "student_id": 1}
            ]

            response = client.get(
                "/api/v1/comments/course/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert isinstance(response.json(), list)


# Test para rutas de recuperación de contraseña
class TestPasswordRecoveryRoutes:

    def test_request_password_reset_success(self):
        """Test exitoso de solicitud de recuperación de contraseña"""
        with patch(
            "services.student_services.StudentService.request_password_reset"
        ) as mock_request:
            mock_request.return_value = {"message": "Enlace enviado al correo"}

            response = client.post(
                "/api/v1/auth/request-password-reset",
                json={"email": "test@example.com"},
            )

            assert response.status_code == 200
            assert "enviado" in response.json()["message"]

    def test_reset_password_success(self):
        """Test exitoso de reseteo de contraseña"""
        with patch(
            "services.student_services.StudentService.reset_password"
        ) as mock_reset:
            mock_reset.return_value = {"message": "Contraseña actualizada exitosamente"}

            response = client.post(
                "/api/v1/auth/reset-password",
                json={"token": "fake_token", "new_password": "newpassword123"},
            )

            assert response.status_code == 200
            assert "actualizada" in response.json()["message"]


if __name__ == "__main__":
    pytest.main([__file__])
