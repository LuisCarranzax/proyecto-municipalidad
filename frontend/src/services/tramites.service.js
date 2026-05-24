const API_URL = 'http://localhost:3000/api/tramites';

// Método GET encapsulado
export const obtenerTramites = async () => {
    try {
        const response = await fetch(`${API_URL}/listar`);
        const data = await response.json();
        
        if (data.success) {
            return data.data; // Retornamos solo el arreglo de trámites
        } else {
            console.error("Error en la respuesta del servidor:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Error de conexión al obtener trámites:", error);
        return [];
    }
};

export const eliminarTramite = async (id) => {
    try {
        const response = await fetch(`${API_URL}/eliminar/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("Error al eliminar trámite:", error);
        return false;
    }
};