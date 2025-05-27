import { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1c1c3c;

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
  font-size: 1.8rem;
  color: #25267e;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const FileInputWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background-color: #25267e;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 250px;
  margin: 0 auto 16px auto;

  &:hover {
    background-color: #1c1c5a;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
  word-break: break-all;
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
  margin-top: 10px;

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
  text-align: center;
`;

const ResultSection = styled.div`
  margin-top: 1.5rem;

  h3 {
    color: #25267e;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    background-color: #f1f1f1;
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    color: #333;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #25267e;
  border: 2px solid #25267e;
  margin-top: 8px;

  &:hover {
    background-color: #25267e;
    color: white;
  }
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
        setError(data.message || "Erro ao processar cupom.");
        setLoading(false);
        return;
      }

      setResultado(data);

      // Atualiza os gastos no Dashboard (se foi passado como prop)
      if (typeof onGastosAtualizados === "function") {
        onGastosAtualizados();
      }

    } catch (err) {
      console.error(err);
      setError("Erro ao enviar o cupom.");
    }

    setLoading(false);
  };

  const navigate = useNavigate();

  return (
    <Page>
      <Sidebar />
      <MainContent>
        <Card>
          <Title>Leitura de Cupom Fiscal</Title>

          <FileInputWrapper>
            {file ? "Arquivo Selecionado" : "Selecionar Arquivo"}
            <HiddenInput type="file" onChange={handleFileChange} />
          </FileInputWrapper>

          {file && <FileName>📄 {file.name}</FileName>}

          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Processando..." : "Ler Cupom"}
          </Button>
          <SecondaryButton onClick={() => navigate("/categorias")}>
              Ver Categorias
          </SecondaryButton>

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
