import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1c1c3c;
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

const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

const ResultSection = styled.div`
  margin-top: 1.5rem;
`;

const CupomUploadForm = ({ onGastosAtualizados }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultado(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("imagem", file);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/cupom-upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao processar cupom");
        setLoading(false);
        return;
      }

      setResultado(data);

      // Atualiza gastos no Dashboard (estado no DashboardPage)
      if (typeof onGastosAtualizados === "function") {
        onGastosAtualizados();
      }

    } catch (err) {
      console.error(err);
      setError("Erro ao enviar o cupom");
    }

    setLoading(false);
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

          {error && <ErrorText>{error}</ErrorText>}

          {resultado && resultado.produtos && (
            <ResultSection>
              <h3>Itens encontrados:</h3>
              <ul>
                {resultado.produtos.map((item, index) => (
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

export default CupomUploadForm;
