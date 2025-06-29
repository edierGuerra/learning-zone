#models/student_notification_model.py
'''
Este módulo define el modelo de datos para la tabla intermedia
que registra las notificaciones enviadas a los estudiantes y si han sido leídas.
'''

# Módulos externos
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

# Módulos internos
from database.config_db import Base

class StudentNotification(Base):
    __tablename__ = 'student_notifications'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer) # id_estudiante_noti (foreign key)
    notification_id: Mapped[int] = mapped_column(Integer) # id_notificacion_INT(11) (foreign key)
    is_read: Mapped[str] = mapped_column(String(50)) # leida