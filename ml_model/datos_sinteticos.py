import pandas as pd
import random
from faker import Faker

# Inicializamos Faker en español
fake = Faker('es_ES')

# Configuraciones iniciales
NUM_REGISTROS = 1000

# Definimos los tipos de trámites comunes en una municipalidad
TIPOS_TRAMITE = [
    "Licencia de Funcionamiento",
    "Denuncia por Ruidos Molestos",
    "Solicitud de Reparación de Vía",
    "Pago de Arbitrios",
    "Permiso de Construcción",
    "Queja de Limpieza Pública",
    "Solicitud de Inspección de Defensa Civil"
]

# Diccionarios de palabras clave para simular la lógica humana
# Esto es vital para que el modelo de Machine Learning encuentre patrones
patrones_alta = ["urgente", "peligro", "colapso", "accidente", "inmediato", "riesgo", "derrumbe", "inundación"]
patrones_media = ["revisión", "solicito", "permiso", "licencia", "construcción", "inspección", "vecinos"]
patrones_baja = ["consulta", "información", "copia", "certificado", "pago", "actualización", "duda"]

datos = []

for _ in range(NUM_REGISTROS):
    dni = str(fake.random_int(min=10000000, max=99999999))
    tipo = random.choice(TIPOS_TRAMITE)
    
    # Asignamos una prioridad aleatoria inicial para armar el texto
    prioridad_objetivo = random.choices(["Alta", "Media", "Baja"], weights=[0.2, 0.5, 0.3])[0]
    
    # Generamos un texto base usando Faker
    texto_base = fake.paragraph(nb_sentences=3)
    
    # Inyectamos palabras clave según la prioridad para que el modelo tenga algo que aprender
    if prioridad_objetivo == "Alta":
        palabra_clave = random.choice(patrones_alta)
        asunto = f"Problema {palabra_clave} en mi zona"
    elif prioridad_objetivo == "Media":
        palabra_clave = random.choice(patrones_media)
        asunto = f"Trámite de {palabra_clave} para mi propiedad"
    else:
        palabra_clave = random.choice(patrones_baja)
        asunto = f"Solicitud de {palabra_clave} general"
        
    descripcion = f"Buenos días, escribo por el siguiente motivo: {texto_base} Es un tema relacionado con {palabra_clave}. Agradezco su atención."
    
    datos.append({
        "dni_ciudadano": dni,
        "tipo_tramite": tipo,
        "asunto": asunto,
        "descripcion": descripcion,
        "prioridad_historica": prioridad_objetivo
    })

# Convertimos la lista de diccionarios a un DataFrame de Pandas
df = pd.DataFrame(datos)

# Guardamos el dataset en un archivo CSV
nombre_archivo = "dataset_tramites_municipalidad.csv"
df.to_csv(nombre_archivo, index=False, encoding='utf-8')

print(f"✅ ¡Dataset generado con éxito! Se han guardado {NUM_REGISTROS} registros en '{nombre_archivo}'.")