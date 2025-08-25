#!/usr/bin/env python3
"""
Script para hacer petición HTTP directa al endpoint de verificación
"""
import requests
import json

def test_verification_endpoint():
    """
    Probar el endpoint HTTP directamente
    """
    print("🧪 Probador HTTP del Endpoint de Verificación")
    print("=" * 50)
    
    base_url = input("URL del backend (ej: https://cjetechnology.org/backend): ") or "https://cjetechnology.org/backend"
    token = input("Token de verificación: ")
    student_id = input("ID del estudiante: ")
    
    try:
        student_id = int(student_id)
    except ValueError:
        print("❌ Error: El ID del estudiante debe ser un número")
        return
    
    url = f"{base_url}/api/v1/student/verify_email/"
    params = {
        "email_token": token,
        "id_student": student_id
    }
    
    print(f"🔄 Haciendo petición a: {url}")
    print(f"🔄 Parámetros: {params}")
    print("=" * 50)
    
    try:
        response = requests.get(url, params=params, timeout=30)
        
        print(f"📊 Código de estado: {response.status_code}")
        print(f"📊 Headers de respuesta: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ Respuesta exitosa:")
            try:
                data = response.json()
                print(json.dumps(data, indent=2, ensure_ascii=False))
            except:
                print(response.text)
        else:
            print("❌ Error en la respuesta:")
            try:
                error_data = response.json()
                print(json.dumps(error_data, indent=2, ensure_ascii=False))
            except:
                print(response.text)
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_verification_endpoint()
