import React, { useState } from "react";
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
  margin-left: 220px; /* largura da Sidebar */
  padding: 40px;
  background-color: #eff0f9;
  width: 100%;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #3f4872;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #3f4872;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #3f4872;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #505c8c;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de envio para o backend
  };

  return (
    <Container>
      <Sidebar />
      <ContentWrapper>
        <Title>Editar Perfil</Title>
        <Form onSubmit={handleSubmit}>
          <Label>Nome</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />

          <Label>E-mail</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label>Nova Senha</Label>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Label>Confirmar Nova Senha</Label>
          <Input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <Label>Foto de Perfil</Label>
          <Input
            type="file"
            onChange={(e) => setFotoPerfil(e.target.files[0])}
          />

          <Button type="submit">Salvar</Button>
        </Form>
      </ContentWrapper>
    </Container>
  );
}

export default EditarPerfil;
