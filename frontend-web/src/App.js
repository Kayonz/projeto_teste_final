import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegisterPage from "../src/pages/LoginRegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriasView from "./pages/CategoriasView";
import PrivateRoute from "./components/PrivateRoute";
import PerfilPage from "./pages/PerfilPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <CategoriasView />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
