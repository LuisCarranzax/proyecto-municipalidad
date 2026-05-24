from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title="API Municipalidad - ML Predictor")

# Definir la estructura de los datos que esperamos recibir desde Node.js
class TramiteRequest(BaseModel):
    texto: str

# Cargar el modelo al iniciar el servidor
ruta_modelo = os.path.join(os.path.dirname(__file__), "..", "models", "modelo_prioridad.pkl")
try:
    modelo_ia = joblib.load(ruta_modelo)
    print("[INFO] Modelo de IA cargado correctamente en memoria.")
except Exception as e:
    print(f"[ERROR] Fallo al cargar el modelo: {e}")
    modelo_ia = None

@app.post("/predict")
async def predecir_prioridad(request: TramiteRequest):
    if not modelo_ia:
        raise HTTPException(status_code=500, detail="El modelo no está disponible.")
    
    if not request.texto or len(request.texto.strip()) == 0:
         raise HTTPException(status_code=400, detail="El texto del trámite está vacío.")

    # 1. Hacer la predicción
    prediccion = modelo_ia.predict([request.texto])[0]
    
    # 2. Devolver la respuesta en formato JSON (que Node.js entenderá perfectamente)
    return {
        "prioridad": prediccion,
        "mensaje": "Predicción generada con éxito"
    }