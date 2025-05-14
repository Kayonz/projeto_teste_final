import { useState } from 'react';
import styled from 'styled-components';

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
  display: inline-block;
  margin-bottom: 12px;
`;

const FileName = styled.span`
  display: block;
  margin-bottom: 16px;
  color: #333;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #25267e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #1a1b6a;
  }
`;

const Message = styled.p`
  margin-top: 12px;
  color: green;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;


function CupomUploadForm() {
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

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
      } else {
        setMensagem(data.message || "Erro ao enviar cupom.");
      }
    } catch (err) {
      console.error("Erro ao enviar cupom:", err);
      setMensagem("Erro ao enviar cupom.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  <ButtonGroup>
    <FileLabel htmlFor="fileInput">Escolher Arquivo</FileLabel>
    <HiddenInput
      id="fileInput"
      type="file"
      accept="image/*"
      onChange={(e) => setImagem(e.target.files[0])}
      required
    />
    <Button type="submit">Enviar</Button>
  </ButtonGroup>
  {imagem && <FileName>{imagem.name}</FileName>}
</form>
  );
}

export default CupomUploadForm;
