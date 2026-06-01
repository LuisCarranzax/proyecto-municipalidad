import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import RegistroTramite from './pages/RegistroTramite';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="nuevo-tramite" element={<RegistroTramite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;