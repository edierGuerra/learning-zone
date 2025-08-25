import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.student_services import StudentService
from backend.repository.student_repository import StudentRepository
from backend.database.config_db import get_database_connection
import secrets

async def generate_new_token():
    try:
        # Obtener conexión a la base de datos
        connection = await get_database_connection()
        
        # Crear repositorio y servicio
        student_repo = StudentRepository(connection)
        student_service = StudentService(student_repo)
        
        # Generar nuevo token
        new_token = secrets.token_urlsafe(32)
        
        # Actualizar el token en la base de datos
        cursor = await connection.cursor()
        update_query = """
        UPDATE students 
        SET verify_email_token = %s, verify_email_token_created_at = NOW()
        WHERE idAutoIncrementStudent = %s
        """
        
        await cursor.execute(update_query, (new_token, 10))
        await connection.commit()
        
        # Verificar la actualización
        select_query = """
        SELECT idAutoIncrementStudent, email, verify_email_token, verify_email_token_created_at
        FROM students 
        WHERE idAutoIncrementStudent = %s
        """
        
        await cursor.execute(select_query, (10,))
        result = await cursor.fetchone()
        
        if result:
            print(f"Token generado exitosamente:")
            print(f"Student ID: {result[0]}")
            print(f"Email: {result[1]}")
            print(f"New Token: {result[2]}")
            print(f"Created at: {result[3]}")
            print()
            print(f"URL de confirmación:")
            print(f"https://cjetechnology.org/#/confirmEmailRegister?token={result[2]}")
        else:
            print("No se encontró el estudiante")
            
        await cursor.close()
        await connection.ensure_closed()
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(generate_new_token())
