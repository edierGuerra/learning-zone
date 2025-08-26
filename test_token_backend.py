import requests
import json

# URL del endpoint - DigitalOcean App Platform
url = "https://cjetechnology.org/backend/api/v1/student/verify_email/"

# Token que estamos probando - token real del usuario
test_token = "fd733227-c53f-40a4-8b43-f57c3a87709c"
student_id = 13

# Parámetros
params = {
    "email_token": test_token,
    "id_student": student_id
}

print(f"Testing token: {test_token}")
print(f"Student ID: {student_id}")
print(f"URL: {url}")
print(f"Params: {params}")
print("-" * 50)

try:
    # Hacer la petición
    response = requests.get(url, params=params, timeout=10)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success: {json.dumps(data, indent=2)}")
    else:
        print(f"❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
