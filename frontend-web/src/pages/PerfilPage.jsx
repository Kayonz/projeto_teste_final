import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px 60px;
  overflow-y: auto;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #25267e;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #25267e;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1.8px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  outline-offset: 2px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #25267e;
  }
`;

const ErrorMsg = styled.p`
  color: #e53935;
  margin-top: -10px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Button = styled.button`
  margin-top: 10px;
  background-color: #25267e;
  color: #eff0f9;
  font-weight: 700;
  padding: 12px 0;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  font-size: 18px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1a1c5b;
  }
`;

const FotoPreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 10px;
  border: 1.8px solid #25267e;
`;


function EditarPerfil() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [fotoAtualUrl, setFotoAtualUrl] = useState(null);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar perfil");
        return res.json();
      })
      .then((data) => {
        setNome(data.user.nome);
        setEmail(data.user.email);
        setFotoAtualUrl(`http://localhost:5000/uploads/${data.user.foto_url}`);
      })
      .catch(() => {
        alert("Falha ao carregar perfil, faça login novamente");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  useEffect(() => {
    if (!fotoPerfil) {
      setPreviewFoto(null);
      return;
    }
    const objectUrl = URL.createObjectURL(fotoPerfil);
    setPreviewFoto(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [fotoPerfil]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if ((senha || confirmarSenha) && senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha && senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    if (senha) formData.append("senha", senha);
    if (fotoPerfil) formData.append("fotoPerfil", fotoPerfil);

    fetch("http://localhost:5000/api/auth/me", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar perfil");
        return res.json();
      })
      .then((data) => {
        alert("Perfil atualizado com sucesso!");
        setFotoAtualUrl(`http://localhost:5000/uploads/${data.user.foto_url}`);
        setSenha("");
        setConfirmarSenha("");
        setFotoPerfil(null);
        setPreviewFoto(null);
      })
      .catch(() => {
        setErro("Erro ao atualizar perfil");
      });
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Title>Editar Perfil</Title>
        <Form onSubmit={handleSubmit}>
          <Label>Nome</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <Label>Senha</Label>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Deixe em branco para manter"
          />

          <Label>Confirmar Senha</Label>
          <Input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme a senha"
          />

          <Label>Foto de Perfil</Label>
          <Input
            type="file"
            onChange={(e) => setFotoPerfil(e.target.files[0])}
            accept="image/*"
          />
          {previewFoto ? (
            <FotoPreview src={previewFoto} alt="Preview da foto" />
          ) : fotoAtualUrl ? (
            <FotoPreview src={fotoAtualUrl} alt="Foto atual" />
          ) : null}

          {erro && <ErrorMsg>{erro}</ErrorMsg>}

          <Button type="submit">Salvar</Button>
        </Form>
      </Content>
    </Container>
  );
}

export default EditarPerfil;
