import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #eff0f9;
  padding: 40px;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #25267e;
`;

const LogoutButton = styled.button`
  background-color: #e94560;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #d0304d;
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

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #25267e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #1b1c6a;
  }
`;

function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleAddGasto = () => {
    alert("Abrir leitura do cupom (OCR)");
  };

  const handleSetOrcamento = () => {
    alert("Abrir modal para definir orçamento mensal");
  };

  return (
    <Container>
      <Header>
        <Title>Olá, bem-vindo(a)!</Title>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </Header>

      <Cards>
        <Card>
          <CardTitle>Orçamento Atual</CardTitle>
          <CardValue>R$ 5.000,00</CardValue>
        </Card>

        <Card>
          <CardTitle>Gastos do mês</CardTitle>
          <CardValue>R$ 2.350,00</CardValue>
        </Card>
      </Cards>

      <Actions>
        <ActionButton onClick={handleAddGasto}>+ Adicionar Gasto (Scan)</ActionButton>
        <ActionButton onClick={handleSetOrcamento}>+ Definir Orçamento</ActionButton>
      </Actions>
    </Container>
  );
}

export default DashboardPage;
