import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RegistroTramite from './pages/RegistroTramite';
import Dashboard from './pages/Dashboard'; // Importamos el nuevo componente

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Reemplazamos el texto temporal por el componente Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="nuevo-tramite" element={<RegistroTramite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;