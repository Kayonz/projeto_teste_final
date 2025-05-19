import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar"; // ajuste o caminho se for diferente

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1c1c3c; /* fundo escuro */
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #eff0f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #25267e;
`;

const Input = styled.input`
  margin-right: 1rem;
`;

const Button = styled.button`
  background-color: #25267e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  margin-top: 1.5rem;
`;


const LeitorCupomFiscal = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    // Simulando leitura de cupom
    setTimeout(() => {
      setResultado({
        produtos: [
          { nome: "Produto A", valor: 10.5 },
          { nome: "Produto B", valor: 7.99 },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
  <Page>
    <Sidebar />
    <MainContent>
      <Card>
        <Title>Leitura de Cupom Fiscal</Title>
        <Input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading}>
          {loading ? "Processando..." : "Ler Cupom"}
        </Button>

        {resultado && (
          <ResultSection>
            <h3>Itens encontrados:</h3>
            <ul>
              {resultado.produtos?.map((item, index) => (
                <li key={index}>
                  {item.nome} - R$ {Number(item.valor).toFixed(2)}
                </li>
              ))}
            </ul>
          </ResultSection>
        )}
      </Card>
    </MainContent>
  </Page>
);

};

export default LeitorCupomFiscal;
