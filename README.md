# Mesa de Partes Virtual - Municipalidad Provincial

Este proyecto es una plataforma web para gestionar una **Mesa de Partes Virtual** institucional. Permite a los ciudadanos registrar trámites y documentos, los cuales son analizados automáticamente por un modelo de Inteligencia Artificial para determinar su nivel de prioridad (Alta, Media o Baja) en función del asunto y la descripción.

## 🚀 Arquitectura del Proyecto

El sistema está dividido en múltiples servicios:
- **Frontend (React/Vite)**: Interfaz de usuario con diseño moderno y soporte para temas claros/oscuros.
- **Backend (Node.js/Express)**: API REST encargada de la lógica de negocio, registro de ciudadanos y comunicación con la base de datos y la IA.
- **Microservicio IA (Python/FastAPI)**: Modelo de Machine Learning (scikit-learn) que expone un endpoint (`/predict`) para calcular la prioridad de los trámites en tiempo real.
- **Base de Datos (MySQL)**: Almacena la información de ciudadanos y el historial de trámites.

---

## 🛠️ Cómo Ejecutar el Proyecto

Tienes dos formas de levantar este proyecto: **Localmente (Desarrollo)** o **Mediante Docker**.

### Opción 1: Ejecución Local (Desarrollo Rápido)

Para hacer cambios en vivo usando `nodemon` y `vite` con recarga automática en toda la pila (Frontend, Backend e IA):

1. **Requisitos Previos**:
   - Node.js (v20 o superior).
   - Python 3.11+.
   - Base de datos MySQL corriendo localmente en el puerto `3306` (configurar credenciales en `backend/src/config/db.js` o mediante `.env`).
   - Gestor de paquetes `pnpm` (`npm install -g pnpm`).

2. **Instalación de Dependencias**:
   Ejecuta `pnpm install` en la raíz del proyecto, en `/backend` y en `/frontend`. Para el modelo de IA, dirígete a `ml_model` y ejecuta `pip install -r requirements.txt`.

3. **Ejecución de todo el entorno**:
   ```bash
   pnpm run dev
   ```
   *Esto iniciará en paralelo el backend (puerto 3000), frontend (puerto 5173) y FastAPI (puerto 8000) usando `concurrently`.*

### Opción 2: Ejecución con Docker (Entorno Aislado)

Para levantar toda la infraestructura (Base de Datos, IA, Backend, Frontend) con un solo comando, ideal para pruebas de despliegue:

1. Abre tu terminal en la raíz del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   docker compose up -d --build
   ```
3. Docker descargará todas las dependencias necesarias de manera aislada y levantará todos los servicios.
4. Para detener los contenedores:
   ```bash
   docker compose down
   ```

---

## ⚠️ Consideraciones de Comunicación (Local vs. Docker)

Al estar el sistema dividido en un **Backend (Node.js)** y un **Servicio de IA (Python)**, la forma en que el Backend se conecta a la IA varía dependiendo de cómo estés ejecutando el proyecto:

### 1. Entorno Local (`pnpm run dev`)
Cuando corres el proyecto de manera tradicional (sin Docker), la IA se levanta en tu propia máquina en `localhost:8000`. El backend por defecto está programado para conectarse a:
`http://localhost:8000/predict`

### 2. Entorno Docker (`docker compose up`)
Cuando corres el proyecto dentro de Docker, el concepto de `localhost` desaparece, porque cada contenedor es como una computadora aislada. En Docker, el Backend **no puede** buscar en su `localhost`, sino que debe buscar el "nombre" del contenedor de IA en la red interna de Docker. 

Para resolver esto sin tocar el código fuente cada vez, el archivo `docker-compose.yml` inyecta automáticamente la siguiente variable de entorno al Backend:
`ML_API_URL=http://ml_api:8000/predict`

*(Donde `ml_api` es el nombre del servicio de Python en Docker Compose).* 
El Backend está preparado para priorizar esta variable si detecta que está en un contenedor, evitando el error `ECONNREFUSED ENOTFOUND ml_api`.
