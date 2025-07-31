"""
teacher/routes.py

Este modulo contiene todas la rutas con las diferentes operaciones que puede realizar el profesor
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/teachers", tags=["Teachers"])
