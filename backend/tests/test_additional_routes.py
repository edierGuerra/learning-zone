import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from main import app

client = TestClient(app)


# Test para rutas de identificación
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
            assert response.json()["n_identification"] == 12345678

    def test_get_identification_by_number_not_found(self):
        """Test de identificación no encontrada"""
        with patch(
            "services.identification_services.IdentificationService.get_identification_by_number"
        ) as mock_get:
            mock_get.return_value = None

            response = client.get("/api/v1/identifications/99999999")

            assert response.status_code == 404


# Test para rutas de contenido
class TestContentRoutes:

    @patch("routes.content_routes.get_current_student")
    def test_get_content_by_lesson_success(self, mock_get_current):
        """Test exitoso de obtener contenido por lección"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.content_services.ContentService.get_content_by_lesson_id"
        ) as mock_get_content:
            mock_get_content.return_value = {
                "id": 1,
                "lesson_id": 1,
                "content_type": "text",
                "content": "Contenido de ejemplo",
                "text": "Texto de ejemplo",
            }

            response = client.get(
                "/api/v1/content/lesson/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert response.json()["lesson_id"] == 1

    @patch("routes.content_routes.get_current_student")
    def test_get_content_by_lesson_not_found(self, mock_get_current):
        """Test de contenido no encontrado"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.content_services.ContentService.get_content_by_lesson_id"
        ) as mock_get_content:
            mock_get_content.return_value = None

            response = client.get(
                "/api/v1/content/lesson/999",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 404


# Test para casos de error comunes
class TestErrorHandling:

    def test_unauthorized_access_401(self):
        """Test de acceso no autorizado"""
        response = client.get("/api/v1/students/profile")

        assert response.status_code == 422  # FastAPI devuelve 422 para auth requerido

    def test_invalid_token_format(self):
        """Test de formato de token inválido"""
        response = client.get(
            "/api/v1/students/profile", headers={"Authorization": "Invalid token"}
        )

        assert response.status_code == 422

    def test_missing_required_fields(self):
        """Test de campos requeridos faltantes"""
        response = client.post(
            "/api/v1/students/register",
            json={
                "names": "Juan",
                # Faltan campos requeridos
            },
        )

        assert response.status_code == 422

    def test_invalid_email_format(self):
        """Test de formato de email inválido"""
        response = client.post(
            "/api/v1/students/register",
            json={
                "identification_number": 12345678,
                "names": "Juan",
                "last_names": "Pérez",
                "email": "invalid-email",
                "password": "password123",
            },
        )

        assert response.status_code == 422

    def test_invalid_category_enum(self):
        """Test de categoría inválida para cursos"""
        with patch("teacher.routes.get_current_teacher") as mock_get_current:
            mock_teacher = Mock()
            mock_teacher.id = 1
            mock_get_current.return_value = mock_teacher

            response = client.post(
                "/api/v1/teachers/courses",
                data={
                    "name": "Curso Test",
                    "description": "Descripción test",
                    "category": "categoria_invalida",  # Categoría no válida
                    "name_palette": "azul",
                    "palette": '{"primary": "#0000ff"}',
                },
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 422


# Test para validaciones de negocio
class TestBusinessValidations:

    def test_duplicate_identification_registration(self):
        """Test de registro de identificación duplicada"""
        with patch(
            "services.student_services.StudentService.register_student"
        ) as mock_register:
            from fastapi import HTTPException

            mock_register.side_effect = HTTPException(
                status_code=400, detail="La identificación ya está registrada"
            )

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

            assert response.status_code == 400

    def test_invalid_login_credentials(self):
        """Test de credenciales de login inválidas"""
        with patch(
            "services.student_services.StudentService.login_student"
        ) as mock_login:
            from fastapi import HTTPException

            mock_login.side_effect = HTTPException(
                status_code=401, detail="Credenciales inválidas"
            )

            response = client.post(
                "/api/v1/students/login",
                json={"identification_number": 12345678, "password": "wrong_password"},
            )

            assert response.status_code == 401

    def test_expired_verification_token(self):
        """Test de token de verificación expirado"""
        with patch(
            "services.student_services.StudentService.verify_email"
        ) as mock_verify:
            from fastapi import HTTPException

            mock_verify.side_effect = HTTPException(
                status_code=400, detail="Token expirado"
            )

            response = client.get("/api/v1/students/verify-email/expired_token")

            assert response.status_code == 400

    def test_invalid_refresh_token(self):
        """Test de refresh token inválido"""
        with patch(
            "services.student_services.StudentService.refresh_access_token"
        ) as mock_refresh:
            from fastapi import HTTPException

            mock_refresh.side_effect = HTTPException(
                status_code=401, detail="Refresh token inválido"
            )

            response = client.post(
                "/api/v1/students/refresh",
                json={"refresh_token": "invalid_refresh_token"},
            )

            assert response.status_code == 401


# Test para límites y paginación
class TestLimitsAndPagination:

    @patch("routes.comment_routes.get_current_student")
    def test_get_comments_with_limit(self, mock_get_current):
        """Test de obtener comentarios con límite"""
        mock_student = Mock()
        mock_student.id = 1
        mock_get_current.return_value = mock_student

        with patch(
            "services.comment_services.CommentService.get_comments_by_course"
        ) as mock_get_comments:
            # Simular 50 comentarios
            mock_comments = [
                {"id": i, "content": f"Comentario {i}"} for i in range(1, 51)
            ]
            mock_get_comments.return_value = mock_comments

            response = client.get(
                "/api/v1/comments/course/1",
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            # Verificar que devuelve todos los comentarios (o aplicar límite si existe)
            assert len(response.json()) <= 50


# Test para operaciones en lote
class TestBatchOperations:

    @patch("teacher.routes.get_current_teacher")
    def test_batch_student_identification_upload(self, mock_get_current):
        """Test de carga masiva de identificaciones de estudiantes"""
        mock_teacher = Mock()
        mock_teacher.id = 1
        mock_get_current.return_value = mock_teacher

        with patch(
            "teacher.service.TeacherServices.register_identifications"
        ) as mock_register:
            mock_register.return_value = {
                "processed": 100,
                "successful": 95,
                "duplicates": 3,
                "errors": 2,
            }

            # Simular archivo con muchas identificaciones
            file_content = "\n".join([str(12345678 + i) for i in range(100)])
            file_data = file_content.encode()

            response = client.post(
                "/api/v1/teachers/students/identifications",
                files={"file": ("identifications.txt", file_data, "text/plain")},
                headers={"Authorization": "Bearer fake_token"},
            )

            assert response.status_code == 200
            assert "100 números procesados" in response.json()["message"]
            assert "95 registrados exitosamente" in response.json()["message"]


# Test para integración con servicios externos
class TestExternalServices:

    def test_email_service_integration(self):
        """Test de integración con servicio de email"""
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

            assert response.status_code == 200
            assert "enviada correctamente" in response.json()["message"]
            mock_send_email.assert_called_once()

    def test_file_upload_service(self):
        """Test de servicio de subida de archivos"""
        with patch("teacher.routes.get_current_teacher") as mock_get_current:
            mock_teacher = Mock()
            mock_teacher.id = 1
            mock_get_current.return_value = mock_teacher

            with patch("teacher.service.TeacherServices.create_course") as mock_create:
                mock_create.return_value = 1

                # Simular archivo de imagen más grande
                large_file_data = (
                    b"fake image data" * 1000
                )  # Simular archivo más grande

                response = client.post(
                    "/api/v1/teachers/courses",
                    data={
                        "name": "Curso con Imagen Grande",
                        "description": "Descripción test",
                        "category": "programacion",
                        "name_palette": "azul",
                        "palette": '{"primary": "#0000ff"}',
                    },
                    files={"image": ("large_image.jpg", large_file_data, "image/jpeg")},
                    headers={"Authorization": "Bearer fake_token"},
                )

                assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__])
