import { useState } from "react";
import styled from "styled-components";
import { FaHome, FaMoneyBillWave, FaChartPie, FaSignOutAlt, FaBars, FaCamera } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const SidebarContainer = styled.div`
  height: 100vh;
  width: ${(props) => (props.isOpen ? "220px" : "70px")};
  background-color: #6a0099;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed; /* 🔥 Aqui é a correção */
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
`;
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 20px;
  cursor: pointer;
  font-size: 1.4rem;
  text-align: left;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #925FE2;
  }

  svg {
    margin-right: ${(props) => (props.isOpen ? "16px" : "0")};
    font-size: 1.2rem;
  }

  span {
    display: ${(props) => (props.isOpen ? "inline" : "none")};
    transition: opacity 0.3s ease;
  }
`;

function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <SidebarContainer isOpen={isOpen}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </ToggleButton>

      <MenuItem isOpen={isOpen} onClick={() => navigate("/dashboard")}>
        <FaChartPie />
        <span>Início</span>
      </MenuItem>

      <MenuItem isOpen={isOpen} onClick={() => navigate("/cupom")}>
        <FaCamera />
        <span>Ler Cupom Fiscal</span>
      </MenuItem>

      <MenuItem isOpen={isOpen} onClick={() => navigate("/categorias")}>
       <MdCategory />
       <span>Categorias</span>
      </MenuItem>

      <Link to="/perfil" style={{ textDecoration: "none", color: "inherit" }}>
      <MenuItem isOpen={isOpen}>
        <FaUser />
        <span>Editar Perfil</span>
      </MenuItem>
      </Link>

      <MenuItem isOpen={isOpen} onClick={() => navigate("/login")}>
        <FaSignOutAlt />
        <span>Sair</span>
      </MenuItem>
    </SidebarContainer>
  );
}

export default Sidebar;
