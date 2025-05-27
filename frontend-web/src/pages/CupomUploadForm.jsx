import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  width: 100%;
`;

const Card = styled.div`
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #25267e;
  text-align: center;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
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
`;

const FileInputWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  margin: 0 auto 16px auto;
  background-color: #25267e;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  max-width: 250px;

  &:hover {
    background-color: #1c1c5a;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

const ResultSection = styled.div`
  margin-top: 1.5rem;
`;

const FileName = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #25267e;
  text-align: center;
`;

const CupomUploadForm = ({ onGastosAtualizados }) => {
  const [file, setFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    };

    fetchCategorias();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultado(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !categoriaSelecionada) {
      setError("Selecione uma categoria e um arquivo.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("imagem", file);
      formData.append("categoriaId", categoriaSelecionada); // Enviando categoria selecionada

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

          <Select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            <option value="">Selecione uma Categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </Select>

          <FileInputWrapper>
            {file ? file.name : "Selecionar Arquivo"}
            <HiddenInput type="file" onChange={handleFileChange} />
          </FileInputWrapper>

          {file && <FileName>Arquivo: {file.name}</FileName>}

          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Processando..." : "Ler Cupom"}
          </Button>

          <Button onClick={() => navigate("/categorias")} style={{ marginTop: "10px" }}>
            Ver Categorias
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
