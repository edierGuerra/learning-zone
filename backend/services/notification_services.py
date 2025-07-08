# services/notification_service.py

# Modulos externos
import logging
from fastapi import HTTPException, status

# Modulos internos
from repository.notification_repository import NotificationRepository
from schemas.notification_schemas import NotificationCreate
from .utils.email_sender import send_notification_email

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, notification_repo: NotificationRepository):
        self.notification_repo = notification_repo

    async def send_email_to_students(self, tittle_email: str, message_email: str):
        students = await self.notification_repo.get_all_students()
        for student in students:
            send_notification_email(
                to_email=student.email,
                student_name=student.names,
                notification_message=message_email,
                notification_title=tittle_email,
            )

    async def create_and_distribuite_notification_to_all(
        self, notification_data: NotificationCreate
    ) -> dict:
        """Crea una notificación y la asocia directamente a todos los estudiantes existentes."""
        try:
            # Crear la notificación base
            new_notification = await self.notification_repo.create_notification(
                title=notification_data.title, message=notification_data.message
            )

            # Obtener IDs de todos los estudiantes
            all_student_ids = (
                await self.notification_repo.get_all_student_ids()
            )  # El repositorio obtiene los IDs

            # Asociar la notificación con todos lo estudiantes
            if all_student_ids:
                await self.notification_repo.associate_notification_with_students(
                    notification_id=new_notification.id, student_ids=all_student_ids
                )

                # Enviar notificación por correo electrónico a cada estudiante
                await self.send_email_to_students(
                    tittle_email=notification_data.title,
                    message_email=notification_data.message,
                )
            else:
                logger.warning(
                    "No hay estudiantes en la plataforma para asociar la notificación ID: %s",
                    new_notification.id,
                )

            return {
                "message": "Notificación creada y distribuida a todos los estudiantes.",
                "notification_id": new_notification.id,
            }

        except Exception as e:
            logger.error(
                "Fallo en la creación y distribución de notificación para todos",
                exc_info=e,
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear y distribuir la notificación a todos los estudiantes.",
        )
