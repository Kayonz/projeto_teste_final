import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f6fc;
`;

const Content = styled.main`
  flex: 1;
  padding: 40px;
  margin-left: 80px; /* compensando a sidebar fixa */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #25267e;
  margin-bottom: 40px;
`;

const CardsWrapper = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-width: 260px;
  flex: 1;
`;

const Label = styled.h2`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
`;

const Value = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #25267e;
`;

const Metricas = () => {
  const [totalGasto, setTotalGasto] = useState(0);
  const [valorPoupado, setValorPoupado] = useState(0);
  const [rendimentoSimulado, setRendimentoSimulado] = useState(0);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await axios.get('/api/metricas');
        const { totalGastoMes, poupancaMes, rendimentoSimuladoCDI } = response.data;
        setTotalGasto(totalGastoMes);
        setValorPoupado(poupancaMes);
        setRendimentoSimulado(rendimentoSimuladoCDI);
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    };

    fetchMetricas();
  }, []);

  return (
    <Container>
      <Sidebar />
      <Content>
        <Title>Métricas Financeiras</Title>
        <CardsWrapper>
          <Card>
            <Label>Total gasto este mês</Label>
            <Value>R$ {totalGasto.toFixed(2)}</Value>
          </Card>
          <Card>
            <Label>Valor poupado</Label>
            <Value>R$ {valorPoupado.toFixed(2)}</Value>
          </Card>
          <Card>
            <Label>Rendimento simulado (CDI)</Label>
            <Value>R$ {rendimentoSimulado.toFixed(2)}</Value>
          </Card>
        </CardsWrapper>
      </Content>
    </Container>
  );
};

export default Metricas;
