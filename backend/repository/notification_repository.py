# repository/notification_repository.py


"""
Este modulo contiene todas las operaciones que se le pueden atribuir las notificaciones con la base de datos.
"""

import logging
from typing import List, Tuple
from datetime import datetime

# Modulos externos
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

# Modulos internos
from models.notification_model import Notification
from models.student_model import Student  # necesario para obtener todos los estudiantes

logger = logging.getLogger(__name__)  # Objeto para tirar logs


class NotificationRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_notification(
        self, title: str, message: str, teacher_id: int
    ) -> Notification:
        """Crea una nueva notificacion en la base de datos."""
        try:
            new_notification = Notification(
                title=title,
                message=message,
                teacher_id=teacher_id,
                date=datetime.now(),  # Establece la fecha de creacion aquí
            )
            self.db.add(new_notification)
            await self.db.commit()
            await self.db.refresh(new_notification)
            logger.info("Notificación creada con ID: %s", new_notification.id)
            return new_notification
        except Exception as e:
            logger.error("Error al crear notifición", exc_info=e)
            await self.db.rollback()
            raise  # Relanza la excepcion para que el servicio la maneje

    async def get_all_student_ids(self) -> List[int]:
        """Obtiene una lista de IDs de todos los estudiantes."""
        try:
            result = await self.db.execute(
                select(Student.id)
            )  # Obtiene todos los id_estudiantes
            return result.scalars().all()
        except Exception as e:
            logger.error("Error al obtener todos los IDs de estudiantes", exc_info=e)
            return []

    async def associate_notification_with_students(
        self, notification_id: int, student_ids: List[int]
    ) -> None:
        """Asocia una notificación exitente con todos los estudiantes."""
        if not student_ids:
            logger.warning(
                "No se proporcionaron IDs de estudiantes para asociar la notificación %s.",
                notification_id,
            )
            return

        try:
            # Obtener la notificacion para asegurar que existe
            notification_query = await self.db.execute(
                select(Notification)
                .options(selectinload(Notification.students))
                .where(Notification.id == notification_id)
            )
            notification = notification_query.scalar_one_or_none()

            if not notification:
                logger.warning(
                    "Notification con ID %s no encontrada para sociación.",
                    notification_id,
                )
                return

            # Para asociar todos los estudiantes, podemos usar la relacion many-to-many
            # primero, obtener los objetos Student
            students_to_associate_query = await self.db.execute(
                select(Student).where(Student.id.in_(student_ids))
            )
            students_to_associate = students_to_associate_query.scalars().all()

            # Asociar la notificacion con cada estudiante
            for student in students_to_associate:
                # comprobar si la asociacion ya existe
                if student not in notification.students:
                    notification.students.append(student)

            await self.db.commit()
            logger.info(
                "Notification %s asociada a %s estudiantes.",
                notification_id,
                len(students_to_associate),
            )
        except Exception as e:
            logger.error(
                "Error al asociar notificación %s con estudiantes",
                notification_id,
                exc_info=e,
            )
            raise  # Relanza la excepcion para que el servicio la maneje

    async def get_all_students(self) -> Tuple[Student]:
        """
        Permite tomar todos los estudiantes para mandarles notificaciones.
        """
        result = await self.db.execute(select(Student))

        students = result.scalars().all()

        return tuple(students)
