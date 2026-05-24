import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
import os

# 1. Cargar el dataset generado
ruta_csv = "data/dataset_tramites_municipalidad.csv"
print("Cargando datos...")
df = pd.read_csv(ruta_csv)

# Unimos Asunto y Descripción para darle más contexto al modelo
df['texto_completo'] = df['asunto'] + " " + df['descripcion']

X = df['texto_completo']
y = df['prioridad_historica']

# 2. Dividir los datos (80% para entrenar, 20% para probar)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Crear un Pipeline de Machine Learning
# Pipeline mantiene el código modular: primero vectoriza el texto, luego clasifica
print("Entrenando el modelo...")
modelo_ia = Pipeline([
    ('vectorizador', TfidfVectorizer(stop_words=None, max_features=5000)),
    ('clasificador', MultinomialNB()) # Naive Bayes es excelente y rápido para texto
])

modelo_ia.fit(X_train, y_train)

# 4. Evaluar la efectividad del modelo
print("\n--- Reporte de Clasificación ---")
predicciones = modelo_ia.predict(X_test)
print(classification_report(y_test, predicciones))

# 5. Guardar el modelo entrenado
ruta_modelo = "models/modelo_prioridad.pkl"
os.makedirs("models", exist_ok=True)
joblib.dump(modelo_ia, ruta_modelo)

print(f"\n✅ Modelo guardado exitosamente en '{ruta_modelo}'. Listo para la API.")