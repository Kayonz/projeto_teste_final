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
  background-color: #25267e;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #eff0f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const Title = styled.h1`
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  margin-bottom: 32px;
  text-align: center;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #25267e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #1a1b66;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  text-align: center;
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
        <Title>{isLogin ? "Login" : "Create Account"}</Title>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              placeholder="Name"
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
          <Button onClick={() => setIsLogin(false)} style={{ background: "transparent", color: "#25267e" }}>
            Criar nova conta
          </Button>
        ) : (
          <Button onClick={() => setIsLogin(true)} style={{ background: "transparent", color: "#25267e" }}>
            Já tem conta? Entrar
          </Button>
        )}
      </RightPanel>
    </PageContainer>
  );
}

export default LoginRegisterPage;