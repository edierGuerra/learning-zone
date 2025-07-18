# Minutos transcurridos
from datetime import datetime


def time_since(timestamp: datetime) -> str:
    """Obtiene el tiempo transcurrido en minutos"""
    now = datetime.utcnow()
    delta = now - timestamp
    return delta.total_seconds() // 60
