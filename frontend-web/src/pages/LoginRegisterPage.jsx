import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
`;


const LeftPanel = styled.div`
  flex: 1;
  background-color: #925FE2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #1C1D21;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const Title = styled.h1`
  margin-bottom: 16px;
  color: #fff;
`;

const Subtitle = styled.p`
  margin-bottom: 32px;
  text-align: center;
  max-width: 300px;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 16px; /* antes era 12px */
  width: 100%;
  max-width: 300px;
  border: 1px solid #fff;
  border-radius: 8px;
  font-size: 1rem;
  background-color: transparent;
  text-decoration: none;
  color: white;

  &::placeholder {
    color: #ccc;
  }
`;


const Button = styled.button`
  padding: 12px 24px;
  display: block;
  background-color: #9C6FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin: 16px auto 0 auto;
  transition: all 0.2s ease;

  &:hover {
    background-color: #8b5fd4;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;


const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const FloatingIcons = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none; /* pra não atrapalhar cliques */
`;

const FloatingIcon = styled.img`
  position: absolute;
  width: 40px;
  animation: floatIcon 15s linear infinite;
  opacity: 0.2;

  @keyframes floatIcon {
    0% {
      transform: translateY(100vh) translateX(0);
    }
    100% {
      transform: translateY(-10vh) translateX(30vw);
    }
  }
`;


function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email, senha }
      : { nome, email, senha };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          alert("Cadastro realizado com sucesso!");
          setIsLogin(true);
        }
      } else {
        setErro(data.message || "Erro ao processar a solicitação.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (

    <PageContainer>
      <LeftPanel>
        <Title>Finance Soft!</Title>
      </LeftPanel>

      <RightPanel>
        <Title>{isLogin ? "Login" : "Registre-se Conosco!"}</Title>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit">{isLogin ? "LOGIN" : "SIGN UP"}</Button>
          {erro && <ErrorMessage>{erro}</ErrorMessage>}
        </form>

        {isLogin ? (
          <Button onClick={() => setIsLogin(false)} style={{ color: "#fff" }}>
            Criar nova conta
          </Button>
        ) : (
          <Button onClick={() => setIsLogin(true)} style={{ background: "transparent", color: "#fff" }}>
            Já tem conta? Entrar
          </Button>
        )}
      </RightPanel>
    </PageContainer>
  );
}

export default LoginRegisterPage;