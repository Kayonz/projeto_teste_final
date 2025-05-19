import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #eff0f9;
  font-family: "Montserrat", sans-serif;
  display: flex;
`;

const ContentWrapper = styled.div`
  margin-left: 220px;
  padding: 40px;
  background-color: #eff0f9;
  width: 100%;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #25267e;
  margin-bottom: 24px;
`;

const CategoriaItem = styled.div`
  background: white;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  max-width: 400px;
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoriaNome = styled.h3`
  margin: 0;
  color: #25267e;
`;

const TotalGasto = styled.p`
  margin: 4px 0 0;
  font-weight: bold;
`;

const Setinha = styled.span`
  font-size: 18px;
  transition: transform 0.2s ease;
  user-select: none;
  transform: rotate(${props => (props.aberto ? "180deg" : "0deg")});
`;

// Wrapper que controla a altura e animação de expansão
const DetalhesWrapper = styled.div`
  overflow: hidden;
  max-height: ${props => (props.aberto ? `${props.contentHeight}px` : "0")};
  transition: max-height 0.3s ease;
`;

const DetalhesContent = styled.div`
  padding-top: 12px;
  border-top: 1px solid #ccc;
  color: #555;
`;

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [abertos, setAbertos] = useState({});
  const [contentHeights, setContentHeights] = useState({});
  const [error, setError] = useState(null);
  const detalhesRefs = useRef({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    fetch("http://localhost:5000/api/categorias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        return res.json();
      })
      .then(data => {
        setCategorias(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar as categorias.");
      });
  }, [token]);

  useEffect(() => {
    const heights = {};
    categorias.forEach(cat => {
      const el = detalhesRefs.current[cat.id];
      if (el) {
        heights[cat.id] = el.scrollHeight;
      }
    });
    setContentHeights(heights);
  }, [categorias]);

  const toggleAberto = (id) => {
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container>
      <Sidebar />
      <ContentWrapper>
        <Title>Categorias</Title>
        {error && <p style={{color: "red"}}>{error}</p>}
        {!error && categorias.length === 0 && <p>Nenhuma categoria encontrada.</p>}
        {categorias.map(cat => (
          <CategoriaItem key={cat.id} onClick={() => toggleAberto(cat.id)}>
            <Header>
              <CategoriaNome>{cat.nome}</CategoriaNome>
              <Setinha aberto={abertos[cat.id]}>▼</Setinha>
            </Header>
            <TotalGasto>Total gasto: R$ {parseFloat(cat.totalGasto || 0).toFixed(2)}</TotalGasto>
            <DetalhesWrapper aberto={abertos[cat.id]} contentHeight={contentHeights[cat.id] || 0}>
              <DetalhesContent ref={el => (detalhesRefs.current[cat.id] = el)}>
                <p>Detalhes dos gastos da categoria {cat.nome}:</p>
                <ul>
                  <li>Compra 1 - R$ 50.00</li>
                  <li>Compra 2 - R$ 30.00</li>
                  <li>Compra 3 - R$ 20.00</li>
                </ul>
              </DetalhesContent>
            </DetalhesWrapper>
          </CategoriaItem>
        ))}
      </ContentWrapper>
    </Container>
  );
}

export default CategoriasPage;
