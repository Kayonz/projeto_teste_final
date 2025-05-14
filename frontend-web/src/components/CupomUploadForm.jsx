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

const Input = styled.input`
  display: block;
  margin-bottom: 16px;
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
    <Wrapper>
      <Title>Enviar Cupom Fiscal</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
          required
        />
        <Button type="submit">Enviar</Button>
      </form>
      {mensagem && <Message>{mensagem}</Message>}
    </Wrapper>
  );
}

export default CupomUploadForm;
