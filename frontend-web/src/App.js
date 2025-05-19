import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CupomUploadForm from "./pages/CupomUploadForm";
import DashboardPage from "./pages/DashboardPage";
import CategoriasView from "./pages/CategoriasView";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import PerfilPage from "./pages/PerfilPage";

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
      </Routes>
    </Router>
  );
}

export default App;
