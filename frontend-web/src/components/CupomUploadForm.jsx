import { useState } from 'react';
import styled from 'styled-components';
import { FaCamera, FaFileUpload } from 'react-icons/fa';

const Wrapper = styled.div`
  margin-top: 40px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #25267e;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: 10px 16px;
  background-color: #25267e;
  color: white;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #1a1b6a;
  }
`;

const FileName = styled.span`
  display: block;
  margin-top: 10px;
  color: #25267e;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #1ab188;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #169b77;
  }
`;

const Message = styled.p`
  margin-top: 16px;
  color: ${props => props.error ? 'red' : 'green'};
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const ProdutosList = styled.ul`
  margin-top: 16px;
  padding-left: 0;
  list-style: none;
`;

const ProdutoItem = styled.li`
  background: #f0f0f7;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
`;


function CupomUploadForm() {
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setProdutos([]);

    const formData = new FormData();
    formData.append("imagem", imagem);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/ocr/upload-cupom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem("Cupom processado com sucesso!");
        setProdutos(data.produtos || []);
      } else {
        setMensagem(data.message || "Erro ao enviar cupom.");
      }
    } catch (err) {
      console.error("Erro ao enviar cupom:", err);
      setMensagem("Erro ao enviar cupom.");
    }
  };

  return (
    <Wrapper>
      <Title>Leitura de Cupom</Title>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <FileLabel htmlFor="fileInput">
            <FaCamera /> Selecionar Imagem
          </FileLabel>
          <HiddenInput
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
            required
          />
          <Button type="submit">
            <FaFileUpload /> Enviar
          </Button>
        </div>
        {imagem && <FileName>{imagem.name}</FileName>}
      </form>

      {mensagem && <Message>{mensagem}</Message>}

      {produtos.length > 0 && (
        <>
          <h3 style={{ marginTop: "24px", color: "#25267e" }}>Itens Extraídos:</h3>
          <ProdutosList>
            {produtos.map((p, idx) => (
              <ProdutoItem key={idx}>
                <span>{p.nome}</span>
                <strong>R$ {p.valor.toFixed(2)}</strong>
              </ProdutoItem>
            ))}
          </ProdutosList>
        </>
      )}
    </Wrapper>
  );
}

export default CupomUploadForm;
