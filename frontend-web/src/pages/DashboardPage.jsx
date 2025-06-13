import styled from "styled-components";
import Sidebar from "../components/SideBar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2", "#D65DB1"];

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #eff0f9;
  font-family: "Montserrat", sans-serif;
  overflow-y: auto;
`;

const Title = styled.h1`
  color: #3f4872;
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

const LogoutButton = styled.button`
  background-color: rgb(74, 9, 179);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgb(64, 5, 153);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Actions = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #3f4872;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #505c8c;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ContentWrapper = styled.div`
  margin-left: 220px;
  padding: 40px;
  background-color: #eff0f9;
  min-height: 100vh;
`;

const LogoutWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: ${({ show }) => (show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const Modal = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  color: #25267e;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

function DashboardPage() {
  const [orcamento, setOrcamento] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [percentualGasto, setPercentualGasto] = useState(0);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoOrcamento, setNovoOrcamento] = useState("");
  const [showConfirmZerar, setShowConfirmZerar] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDados();
    fetchGastosPorCategoria();
  }, [token]);

  const fetchDados = async () => {
    try {
      const orcamentoRes = await fetch("http://localhost:5000/api/orcamento", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orcamentoData = await orcamentoRes.json();
      const orc = parseFloat(orcamentoData.orcamento) || 0;
      setOrcamento(orc);

      const gastosRes = await fetch("http://localhost:5000/api/gastos-por-categoria", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gastosData = await gastosRes.json();
      const totalGastos = gastosData.reduce((sum, item) => sum + parseFloat(item.valor), 0);
      setGastos(totalGastos);

      const saldoAtual = orc - totalGastos;
      setSaldo(saldoAtual >= 0 ? saldoAtual : 0);

      const percentual = orc > 0 ? ((totalGastos / orc) * 100).toFixed(2) : 0;
      setPercentualGasto(percentual);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchGastosPorCategoria = () => {
    fetch("http://localhost:5000/api/gastos-por-categoria", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const parsedData = data.map(item => ({
          ...item,
          valor: Number(item.valor),
        }));
        setGastosPorCategoria(parsedData);
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSetOrcamento = () => setShowModal(true);

  const handleConfirmOrcamento = () => {
    const valor = parseFloat(novoOrcamento);
    if (isNaN(valor)) {
      alert("Digite um valor válido.");
      return;
    }

    fetch("http://localhost:5000/api/orcamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ valor }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        setNovoOrcamento("");
        fetchDados();
      })
      .catch((err) => console.error(err));
  };

  const handleZerarOrcamento = () => setShowConfirmZerar(true);

  const handleConfirmZerar = () => {
    fetch("http://localhost:5000/api/orcamento/zerar", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setShowConfirmZerar(false);
        fetchDados();
      })
      .catch((err) => console.error(err));
  };

  const handleOpenCupom = () => navigate("/cupom");

  return (
    <Container>
      <Sidebar onLogout={handleLogout} />
      <ContentWrapper>
        <LogoutWrapper>
          <LogoutButton onClick={handleLogout}>Fazer Logout</LogoutButton>
        </LogoutWrapper>

        <Title>Dashboard Financeiro</Title>

        <Cards>
          <Card><CardTitle>Saldo Disponível</CardTitle><CardValue>R$ {saldo.toFixed(2)}</CardValue></Card>
          <Card><CardTitle>Gastos do mês</CardTitle><CardValue>R$ {gastos.toFixed(2)}</CardValue></Card>
          <Card><CardTitle>Orçamento Total</CardTitle><CardValue>R$ {orcamento.toFixed(2)}</CardValue></Card>
          <Card><CardTitle>Percentual Gasto</CardTitle><CardValue>{percentualGasto}%</CardValue></Card>
        </Cards>

        <Actions>
          <ActionButton onClick={handleOpenCupom}>+ Ler Cupom Fiscal</ActionButton>
          <ActionButton onClick={handleSetOrcamento}>+ Definir Orçamento</ActionButton>
          <ActionButton onClick={handleZerarOrcamento}>Zerar Orçamento</ActionButton>
        </Actions>

        <h2 style={{ marginTop: "40px", color: "#3f4872" }}>Gastos por Categoria</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={gastosPorCategoria}
                dataKey="valor"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {gastosPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h2 style={{ marginTop: "40px", color: "#3f4872" }}>Histórico de Gastos</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={gastosPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#25267e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ContentWrapper>

      {/* Modal Definir Orçamento */}
      <ModalOverlay show={showModal}>
        <Modal>
          <ModalTitle>Definir Orçamento</ModalTitle>
          <Input
            type="number"
            placeholder="Digite o valor"
            value={novoOrcamento}
            onChange={(e) => setNovoOrcamento(e.target.value)}
          />
          <ModalActions>
            <ActionButton onClick={() => setShowModal(false)}>Cancelar</ActionButton>
            <ActionButton onClick={handleConfirmOrcamento}>Salvar</ActionButton>
          </ModalActions>
        </Modal>
      </ModalOverlay>

      {/* Modal Confirmar Zerar */}
      <ModalOverlay show={showConfirmZerar}>
        <Modal>
          <ModalTitle>Tem certeza que deseja zerar o orçamento?</ModalTitle>
          <ModalActions>
            <ActionButton onClick={() => setShowConfirmZerar(false)}>Cancelar</ActionButton>
            <ActionButton onClick={handleConfirmZerar}>Confirmar</ActionButton>
          </ModalActions>
        </Modal>
      </ModalOverlay>
    </Container>
  );
}

export default DashboardPage;
