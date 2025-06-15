import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CupomUploadForm from "./pages/CupomUploadForm";
import DashboardPage from "./pages/DashboardPage";
import CategoriasView from "./pages/CategoriasView";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import PerfilPage from "./pages/PerfilPage";
import MetricasPage from "./pages/MetricasPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/categorias" element={<CategoriasView />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/cupom" element={<CupomUploadForm />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/metricas" element={<MetricasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
