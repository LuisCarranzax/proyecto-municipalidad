import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Municipalidad Prov.</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '5px 0 0' }}>Mesa de Partes Virtual</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Inicio / Trámites
        </NavLink>
        <NavLink to="/nuevo-tramite" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Registrar Trámite
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;