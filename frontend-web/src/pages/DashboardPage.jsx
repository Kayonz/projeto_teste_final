import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #1a1a2e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Card = styled.div`
  background-color: #16213e;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #e94560;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #ff4d6d;
  }
`;

function DashboardPage() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container>
      <Card>
        <Title>Dashboard</Title>
        {token ? (
          <>
            <p>Bem-vindo ao seu controle financeiro!</p>
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
          </>
        ) : (
          <p>Você não está logado.</p>
        )}
      </Card>
    </Container>
  );
}

export default DashboardPage;
