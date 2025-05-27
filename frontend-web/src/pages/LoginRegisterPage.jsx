import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

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
  position: relative;
  z-index: 2;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

/* ======= Animação dos círculos ======= */
const float = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-40px) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
`;

const FloatingContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Circle = styled.div`
  position: absolute;
  width: ${({ size }) => size || 50}px;
  height: ${({ size }) => size || 50}px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  animation: ${float} ${({ duration }) => duration}s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

/* ====================================== */

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

    const payload = isLogin ? { email, senha } : { nome, email, senha };

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

  const circlesData = [
    { top: "10%", left: "20%", size: 80, duration: 6, delay: 0 },
    { top: "15%", left: "70%", size: 60, duration: 8, delay: 1 },
    { top: "80%", left: "30%", size: 90, duration: 7, delay: 2 },
    { top: "85%", left: "75%", size: 70, duration: 6, delay: 0.5 },
    { top: "50%", left: "50%", size: 100, duration: 10, delay: 1.5 },
    { top: "60%", left: "10%", size: 50, duration: 5, delay: 0.7 },
    { top: "5%", left: "50%", size: 60, duration: 7, delay: 1 },
  ];

  return (
    <PageContainer>
      <LeftPanel>
        <MainTitle>Finance Soft</MainTitle>
        <Subtitle>Encurtando seu tempo e suas finanças!</Subtitle>
      </LeftPanel>

      <RightPanel>
        <LoginTitle>{isLogin ? "Login" : "Cadastro"}</LoginTitle>

        <Subtitle>Bem-vindo ao Finance Soft.</Subtitle>

        <Form onSubmit={handleSubmit}>
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
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</Button>
          {erro && <ErrorMessage>{erro}</ErrorMessage>}
        </Form>

        {isLogin ? (
          <ToggleButton onClick={() => setIsLogin(false)}>
            Não tem conta? Cadastre-se
          </ToggleButton>
        ) : (
          <ToggleButton onClick={() => setIsLogin(true)}>
            Já tem conta? Entrar
          </ToggleButton>
        )}
      </RightPanel>

      <FloatingContainer>
        {circlesData.map((circle, idx) => (
          <Circle
            key={idx}
            top={circle.top}
            left={circle.left}
            size={circle.size}
            duration={circle.duration}
            delay={circle.delay}
          />
        ))}
      </FloatingContainer>
    </PageContainer>
  );
}

export default LoginRegisterPage;
