import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  background-color: #1a1a2e;
  min-height: 100vh;
  color: #fff;
`;

const Main = styled.main`
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  background-color: #161624;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background-color: #22223b;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: 2px solid #25267e;
  }
`;

const FotoPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  object-fit: cover;
  border: 3px solid #25267e;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  background-color: #25267e;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #1a1a5e;
  }
`;

const Error = styled.p`
  color: #ff4d4d;
  font-weight: bold;
  text-align: center;
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
        if (data.user.foto_url) {
          setFotoAtualUrl(`http://localhost:5000/uploads/${data.user.foto_url}`);
        }
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
        // Atualiza a imagem e limpa inputs de senha
        if (data.user.foto_url) {
          setFotoAtualUrl(`http://localhost:5000/uploads/${data.user.foto_url}`);
        }
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
      <Main>
        <FormContainer>
          <Title>Editar Perfil</Title>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {(previewFoto || fotoAtualUrl) && (
                <FotoPreview src={previewFoto || fotoAtualUrl} alt="Foto de Perfil" />
              )}
              <div>
                <Label>Foto de Perfil</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoPerfil(e.target.files[0])}
                />
              </div>
            </div>

            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Senha (opcional)</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova senha"
              />
            </div>

            <div>
              <Label>Confirmar Senha</Label>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar nova senha"
              />
            </div>

            {erro && <Error>{erro}</Error>}

            <Button type="submit">Salvar Alterações</Button>
          </Form>
        </FormContainer>
      </Main>
    </Container>
  );
}

export default EditarPerfil;
