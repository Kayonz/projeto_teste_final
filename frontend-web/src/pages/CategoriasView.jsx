import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

const CategoriaItem = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f2f3ff;
  }

  h3 {
    margin: 0;
    color: #25267e;
  }

  p {
    margin: 4px 0 0;
    font-weight: bold;
  }
`;

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/categorias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Erro ao carregar categorias:", err));
  }, []);

  const handleCategoriaClick = (categoria) => {
    // Exibir detalhes da categoria, como modal ou navegação
    alert(`Gastos detalhados para: ${categoria.nome}`);
  };

  return (
    <Container>
      <h2 style={{ color: "#25267e" }}>Categorias</h2>
      {categorias.map((cat) => (
        <CategoriaItem key={cat.id} onClick={() => handleCategoriaClick(cat)}>
          <h3>{cat.nome}</h3>
          <p>Total gasto: R$ {parseFloat(cat.totalGasto || 0).toFixed(2)}</p>
        </CategoriaItem>
      ))}
    </Container>
  );
}

export default CategoriasPage;
