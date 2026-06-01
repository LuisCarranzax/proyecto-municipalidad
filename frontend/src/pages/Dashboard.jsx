import { useState, useEffect } from 'react';
import { obtenerTramites, eliminarTramite } from '../services/tramites.service';

const Dashboard = () => {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el Modal de Correo (Detalles)
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados para la Alerta Flotante (Toast)
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '' });

  // Estados para la Confirmación de Eliminación
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await obtenerTramites();
    setTramites(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 1. Abre el modal de confirmación en lugar del nativo
  const solicitarEliminacion = (e, id) => {
    e.stopPropagation();
    setIdAEliminar(id);
    setConfirmacionAbierta(true);
  };

  // 2. Ejecuta la eliminación real si el usuario confirma
  const confirmarEliminacion = async () => {
    if (!idAEliminar) return;

    const exito = await eliminarTramite(idAEliminar);
    if (exito) {
      setTramites(tramites.filter(t => t.id_tramite !== idAEliminar));
      
      setAlerta({ mostrar: true, mensaje: 'Trámite eliminado correctamente del sistema.' });
      setTimeout(() => setAlerta({ mostrar: false, mensaje: '' }), 4000);
    }
    
    setConfirmacionAbierta(false);
    setIdAEliminar(null);
  };

  // 3. Cancela la acción
  const cancelarEliminacion = () => {
    setConfirmacionAbierta(false);
    setIdAEliminar(null);
  };

  const abrirModal = (tramite) => {
    setTramiteSeleccionado(tramite);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTramiteSeleccionado(null);
  };

  const notificarCiudadano = (tramite) => {
    setAlerta({ 
      mostrar: true, 
      mensaje: `Mensaje de recepción enviado a ${tramite.nombre} (${tramite.email || 'correo no registrado'})` 
    });
    setTimeout(() => setAlerta({ mostrar: false, mensaje: '' }), 4000);
  };

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case 'alta': return 'badge badge-alta';
      case 'media': return 'badge badge-media';
      case 'baja': return 'badge badge-baja';
      default: return 'badge badge-default';
    }
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      {alerta.mostrar && (
        <div className="custom-alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {alerta.mensaje}
        </div>
      )}

      {confirmacionAbierta && (
        <div className="modal-overlay" onClick={cancelarEliminacion}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 style={{ margin: '0', color: '#0f172a', fontSize: '1.25rem' }}>¿Eliminar registro?</h2>
            <p style={{ color: '#64748b', margin: '0', fontSize: '0.95rem' }}>
              Esta acción no se puede deshacer. El expediente será borrado permanentemente del sistema.
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={cancelarEliminacion} style={{ width: '100%' }}>Cancelar</button>
              <button className="btn-danger" onClick={confirmarEliminacion} style={{ width: '100%' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto && tramiteSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div className="email-metadata">
                <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '600' }}>
                  {tramiteSeleccionado.tipo_tramite}
                </span>
                <div style={{ fontSize: '1.1rem', marginTop: '4px' }}>
                  <strong>De:</strong> {tramiteSeleccionado.nombre} {tramiteSeleccionado.apellidos} &lt;{tramiteSeleccionado.email || 'Sin correo'}&gt;
                </div>
                <span><strong>DNI:</strong> {tramiteSeleccionado.dni} | <strong>Tel:</strong> {tramiteSeleccionado.telefono || 'No registrado'}</span>
                <span><strong>Fecha:</strong> {formatearFecha(tramiteSeleccionado.fecha_creacion)}</span>
              </div>
              
              <button className="btn-icon" onClick={cerrarModal} title="Cerrar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <h3 className="email-subject">Asunto: {tramiteSeleccionado.asunto}</h3>
              <div className="email-message">
                {tramiteSeleccionado.descripcion}
              </div>
              
              <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={getPrioridadBadge(tramiteSeleccionado.prioridad_ia)}>
                    Prioridad {tramiteSeleccionado.prioridad_ia}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    Evaluación de IA
                  </span>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ borderRadius: '50px', padding: '0.4rem 1.2rem', fontSize: '0.85rem', width: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}
                  onClick={() => notificarCiudadano(tramiteSeleccionado)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Notificar Recepción
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginTop: 0, color: '#1e293b' }}>Bandeja de Trámites</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Gestión y priorización automatizada por IA.</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={cargarDatos}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Actualizar
        </button>
      </div>

      <div className="table-container">
        {cargando ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Cargando datos...</div>
        ) : tramites.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No hay trámites registrados.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Expediente</th>
                <th>Ciudadano</th>
                <th>Tipo de Trámite</th>
                <th>Fecha Ingreso</th>
                <th>Prioridad (IA)</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite) => (
                <tr 
                  key={tramite.id_tramite} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => abrirModal(tramite)}
                  title="Clic para ver detalles"
                >
                  <td style={{ fontWeight: '500', color: '#0f172a' }}>
                    EXP-{tramite.id_tramite.toString().padStart(5, '0')}
                  </td>
                  <td>{tramite.nombre} {tramite.apellidos}</td>
                  <td>{tramite.tipo_tramite}</td>
                  <td style={{ color: '#64748b' }}>{formatearFecha(tramite.fecha_creacion)}</td>
                  <td>
                    <span className={getPrioridadBadge(tramite.prioridad_ia)}>
                      {tramite.prioridad_ia}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-icon delete" 
                      onClick={(e) => solicitarEliminacion(e, tramite.id_tramite)}
                      title="Eliminar Trámite"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;