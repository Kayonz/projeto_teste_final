import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1c1c3c;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #eff0f9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color:rgb(37, 2, 2);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Input = styled.input`
  margin-right: 1rem;
  width: 100%;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  font-weight: bold;
  background-color: #25267e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

const ResultSection = styled.div`
  margin-top: 1.5rem;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const FileInputWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  margin: 0 auto 16px auto; 
  margin-bottom: 16px;
  background-color: #25267e;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 250px;

  &:hover {
    background-color: #1c1c5a;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    color:rgb(255, 255, 255);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #25267e;
  text-align: center;
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
          
          <FileInputWrapper>
            {file ? file.name : "Selecionar Arquivo"}
            <HiddenInput type="file" onChange={handleFileChange} />
          </FileInputWrapper>

          {file && <FileName>Arquivo: {file.name}</FileName>}

          <Button onClick={handleUpload} disabled={loading || !file}>
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
