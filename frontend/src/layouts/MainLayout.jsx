import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/layout.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Aquí se renderizarán las páginas (Dashboard o Registro) */}
      </main>
    </div>
  );
};

export default MainLayout;