import { Link } from "react-router-dom";
const StyledContainer = styled.div`
  font-family: "Montserrat", sans-serif;
`;

function RegisterPage() {
  return (
    <div>
      <h1>Cadastro</h1>
      <form>
        <input type="text" placeholder="Nome" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem conta? <Link to="/">Faça login</Link></p>
    </div>
  );
}



export default RegisterPage;
