import { useState } from 'react';

const RegistroTramite = () => {
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '' });
  
  const [formData, setFormData] = useState({
    dni: '', nombre: '', apellidos: '', telefono: '', email: '', 
    tipo_tramite: '', asunto: '', descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/tramites/nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setAlerta({ 
          mostrar: true, 
          mensaje: `Trámite registrado. Prioridad asignada: ${data.data.prioridad_asignada}` 
        });
        setTimeout(() => setAlerta({ mostrar: false, mensaje: '' }), 4000);

        setFormData({ dni: '', nombre: '', apellidos: '', telefono: '', email: '', tipo_tramite: '', asunto: '', descripcion: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-wrapper">
      {alerta.mostrar && (
        <div className="custom-alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {alerta.mensaje}
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0, color: '#1e293b' }}>Registrar Nuevo Trámite</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '1.05rem' }}>
          Complete todos los campos obligatorios (<span className="required-marker">*</span>) para procesar la solicitud.
        </p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Fila 1: DNI y Teléfono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>DNI <span className="required-marker">*</span></label>
              <input type="text" name="dni" className="form-control form-control-lg" maxLength="8" required value={formData.dni} onChange={handleChange} placeholder="Ej. 12345678" />
            </div>
            <div className="form-group">
              <label>Teléfono <span className="required-marker">*</span></label>
              <input type="text" name="telefono" className="form-control form-control-lg" required value={formData.telefono} onChange={handleChange} placeholder="Ej. 987654321" />
            </div>
          </div>

          {/* Fila 2: Nombres y Apellidos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Nombres <span className="required-marker">*</span></label>
              <input type="text" name="nombre" className="form-control form-control-lg" required value={formData.nombre} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Apellidos <span className="required-marker">*</span></label>
              <input type="text" name="apellidos" className="form-control form-control-lg" required value={formData.apellidos} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" className="form-control form-control-lg" value={formData.email} onChange={handleChange} placeholder="Opcional" />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />

          {/* Datos del Trámite */}
          <div className="form-group">
            <label>Tipo de Trámite <span className="required-marker">*</span></label>
            <select name="tipo_tramite" className="form-control form-control-lg" required value={formData.tipo_tramite} onChange={handleChange}>
              <option value="" disabled>-- Seleccione un trámite --</option>
              <option value="Licencia de Funcionamiento">Licencia de Funcionamiento</option>
              <option value="Pago de Arbitrios">Pago de Arbitrios</option>
              <option value="Inspección de Defensa Civil">Inspección de Defensa Civil</option>
              <option value="Queja o Denuncia">Queja o Denuncia</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Asunto Breve <span className="required-marker">*</span></label>
            <input type="text" name="asunto" className="form-control form-control-lg" required value={formData.asunto} onChange={handleChange} placeholder="Resumen de la solicitud" />
          </div>

          <div className="form-group">
            <label>Descripción Detallada <span className="required-marker">*</span></label>
            <textarea name="descripcion" className="form-control form-control-lg" rows="4" required value={formData.descripcion} onChange={handleChange} placeholder="Detalle aquí su solicitud. Esta información será analizada por el sistema de Inteligencia Artificial." />
          </div>

          <button type="submit" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem' }}>
            Registrar y Evaluar Trámite
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroTramite;