#!/usr/bin/env python3
"""
Script para probar la validación del token del correo directamente en el backend
"""
import asyncio
import sys
import os

# Agregar el directorio backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.student_services import StudentService
from database.config_db import async_session

async def test_token_validation():
    """
    Función para probar la validación del token directamente
    """
    # Token de ejemplo que deberías obtener del email o logs
    test_token = input("Ingresa el token del email que quieres validar: ")
    test_id_student = input("Ingresa el ID del estudiante: ")
    
    try:
        test_id_student = int(test_id_student)
    except ValueError:
        print("❌ Error: El ID del estudiante debe ser un número")
        return
    
    print(f"🔍 Probando token: {test_token}")
    print(f"🔍 Para estudiante ID: {test_id_student}")
    print("="*50)
    
    async with async_session() as session:
        student_service = StudentService(session)
        
        try:
            # Probar la verificación del email
            print("🔄 Verificando token...")
            result = await student_service.verify_email(
                id_student=test_id_student, 
                token=test_token
            )
            
            print(f"✅ Resultado de verify_email: {result}")
            
            if result:
                # Obtener el estudiante
                print("🔄 Obteniendo datos del estudiante...")
                student = await student_service.get_student_by_id(test_id_student)
                
                if student:
                    print(f"✅ Estudiante encontrado:")
                    print(f"   - ID: {student.id}")
                    print(f"   - Email: {student.email}")
                    print(f"   - Nombre: {student.names}")
                    print(f"   - Verificado: {student.is_verified}")
                else:
                    print("❌ Error: Estudiante no encontrado")
            else:
                print("❌ Error: Token inválido o expirado")
                
        except Exception as e:
            print(f"❌ Error durante la validación: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print("🧪 Probador de Token de Verificación de Email")
    print("=" * 50)
    asyncio.run(test_token_validation())
