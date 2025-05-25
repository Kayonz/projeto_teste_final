import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";

const PageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
  position: relative;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #9c6fe4;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-width: 480px;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #1c1d21;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-width: 480px;
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-weight: 700;
`;

const LoginTitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
  color: #fff;
  font-weight: 600;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  text-align: center;
  max-width: 350px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const Input = styled.input`
  margin-bottom: 1.2rem;
  padding: 0.9rem 1.2rem;
  width: 100%;
  max-width: 350px;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: border 0.3s ease;

  &:focus {
    border-color: #9c6fe4;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 0.9rem 2rem;
  background-color: #9c6fe4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1rem 0;
  width: 100%;
  max-width: 350px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #8b5fd4;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ToggleButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #9c6fe4;
  margin-top: 0.5rem;

  &:hover {
    background-color: rgba(156, 111, 228, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin: 0.5rem 0 0 0;
  text-align: center;
  font-size: 0.9rem;
`;

const floatIcon = keyframes`
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-10vh) translateX(30vw);
    opacity: 0;
  }
`;

const FloatingIcons = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 0;
`;

const FloatingIcon = styled.img`
  position: absolute;
  width: ${({ size }) => size || 40}px;
  opacity: 0.2;
  animation: ${floatIcon} ${({ duration }) => duration || 15}s linear infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
  left: ${({ left }) => left || "0%"};
  bottom: -40px;
  user-select: none;
  pointer-events: none;
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
        body: JSON.stringify(payload),
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

  const floatingIconsData = [
    { src: icon1, left: "-50%", size: 500, duration: 10, delay: "0s" },
    { src: icon2, left: "15%", size: 250, duration: 12, delay: "2s" },
    { src: icon3, left: "28%", size: 250, duration: 9, delay: "1s" },
    { src: icon1, left: "40%", size: 250, duration: 11, delay: "3s" },
    { src: icon2, left: "55%", size: 250, duration: 10, delay: "1s" },
    { src: icon3, left: "70%", size: 250, duration: 13, delay: "4s" },
    { src: icon1, left: "85%", size: 250, duration: 9, delay: "2s" },
    { src: icon2, left: "90%", size: 250, duration: 8, delay: "0.5s" },
  ];

  return (
    <PageContainer>
      <LeftPanel>
        <MainTitle>Finance Soft</MainTitle>
        <Subtitle>Tire foto do seu cupom, e veja quanto gastou!</Subtitle>
      </LeftPanel>

      <RightPanel>
        <LoginTitle>Login</LoginTitle>
        
        <Subtitle>Ben vindo ao Finance Soft</Subtitle>
        
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
          <Button type="submit">{isLogin ? "Login" : "Registre-se"}</Button>
          {erro && <ErrorMessage>{erro}</ErrorMessage>}
        </form>

        {isLogin ? (
          <ToggleButton onClick={() => setIsLogin(false)}>
            Don't have an account? Sign up
          </ToggleButton>
        ) : (
          <ToggleButton onClick={() => setIsLogin(true)}>
            Já tem conta? Entrar
          </ToggleButton>
        )}
      </RightPanel>

      <FloatingIcons>
        {floatingIconsData.map((icon, idx) => (
          <FloatingIcon
            key={idx}
            src={icon.src}
            left={icon.left}
            size={icon.size}
            duration={icon.duration}
            delay={icon.delay}
            alt="floating icon"
          />
        ))}
      </FloatingIcons>
    </PageContainer>
  );
}

export default LoginRegisterPage;