import styled from "styled-components";
import CategoriasView from "./CategoriasView";
import Sidebar from "../components/SideBar.jsx";
import { useEffect, useState } from "react";
import CupomUploadForm from "./CupomUploadForm.jsx";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #eff0f9;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #3f4872;
`;

const LogoutButton = styled.button`
  background-color: rgb(74, 9, 179);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(64, 5, 153);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Cards = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 40px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 250px;
`;

const CardTitle = styled.h3`
  color: #25267e;
  margin-bottom: 10px;
`;

const CardValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: #1ab188;
`;

const Actions = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ContentWrapper = styled.div`
  margin-left: 220px; /* mesma largura da Sidebar */
  padding: 40px;
  transition: margin-left 0.3s ease;
  background-color: #eff0f9;
  min-height: 100vh;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #3f4872;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #505c8c;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LogoutWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

function DashboardPage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [orcamento, setOrcamento] = useState(0);
  const [gastos, setGastos] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/api/orcamento", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar orçamento");
        return res.json();
      })
      .then((data) => {
        setOrcamento(Number(data.orcamento) || 0);
      })
      .catch((err) => {
        console.error(err);
        setOrcamento(0);
      });

    fetchGastos();
  }, [token]);


  useEffect(() => {
    if (currentView === "dashboard") {
      fetchGastos();
    }
  }, [currentView]);

  const fetchGastos = () => {
    fetch("http://localhost:5000/api/gastos-mes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar gastos");
        return res.json();
      })
      .then((data) => {
        setGastos(Number(data.totalGastos) || 0);
      })
      .catch((err) => {
        console.error(err);
        setGastos(0);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSetOrcamento = () => {
    const valorAdicionar = prompt("Digite o valor a adicionar ao orçamento:");

    if (!valorAdicionar || isNaN(valorAdicionar)) {
      alert("Valor inválido!");
      return;
    }

    const valorSomado = orcamento + parseFloat(valorAdicionar);

    fetch("http://localhost:5000/api/orcamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ valor: valorSomado }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar orçamento");
        return res.json();
      })
      .then(() => {
        alert("Orçamento atualizado com sucesso");
        setOrcamento(valorSomado);
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao atualizar orçamento");
      });
  };

  const handleOpenCupom = () => {
  navigate("/cupom");
  };

  const handleNavigation = (destino) => {
    setCurrentView(destino);
  };

  return (
    <Container>
      <Sidebar onNavigate={handleNavigation} onLogout={handleLogout} />
      <ContentWrapper>
        {currentView === "dashboard" && (
          <>
            <LogoutWrapper>
              <LogoutButton onClick={handleLogout}>Fazer Logout</LogoutButton>
            </LogoutWrapper>

            <Title>Olá, bem-vindo!</Title>

            <Cards>
              <Card>
                <CardTitle>Disponível</CardTitle>
                <CardValue>
                  R$ {(orcamento - gastos).toFixed(2)}
                </CardValue>
              </Card>

              <Card>
                <CardTitle>Gastos do mês</CardTitle>
                <CardValue>R$ {gastos.toFixed(2)}</CardValue>
              </Card>
            </Cards>

            <Actions>
              <ActionButton onClick={handleOpenCupom}>+ Ler Cupom Fiscal</ActionButton>
              <ActionButton onClick={handleSetOrcamento}>+ Adicionar ao Orçamento</ActionButton>
            </Actions>
          </>
        )}

        {currentView === "categorias" && <CategoriasView />}

        {currentView === "gasto" && (
          <CupomUploadForm
            onGastosAtualizados={fetchGastos}
            voltarDashboard={() => setCurrentView("dashboard")}
          />
        )}
      </ContentWrapper>
    </Container>
  );
}

export default DashboardPage;
