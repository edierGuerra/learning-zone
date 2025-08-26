import requests
import json

# Test del endpoint de login de estudiante
url = "https://cjetechnology.org/backend/api/v1/student/login"

# Credenciales de prueba (debes cambiar por credenciales reales)
test_credentials = {
    "email": "edierguerra55@gmail.com",  # Cambia por un email real
    "password": "test123"  # Cambia por la contraseña real
}

print(f"Testing student login endpoint:")
print(f"URL: {url}")
print(f"Credentials: {test_credentials}")
print("-" * 50)

try:
    response = requests.post(url, json=test_credentials, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login Success: {json.dumps(data, indent=2)}")
    else:
        print(f"❌ Login Error: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
