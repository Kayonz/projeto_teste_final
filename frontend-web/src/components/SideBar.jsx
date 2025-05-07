import React, { useState } from "react";
import styled from "styled-components";
import { FaHome, FaMoneyBillWave, FaChartPie, FaSignOutAlt, FaBars } from "react-icons/fa";

const SidebarContainer = styled.div`
  height: 100vh;
  width: ${(props) => (props.isOpen ? "220px" : "70px")};
  background-color: #25267e;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
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
    background-color: #1b1c6a;
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

function Sidebar({ onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContainer isOpen={isOpen}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        <FaBars />
      </ToggleButton>

      <MenuItem isOpen={isOpen} onClick={() => onNavigate("dashboard")}>
        <FaHome />
        <span>Dashboard</span>
      </MenuItem>

      <MenuItem isOpen={isOpen} onClick={() => onNavigate("gasto")}>
        <FaMoneyBillWave />
        <span>Adicionar Gasto</span>
      </MenuItem>

      <MenuItem isOpen={isOpen} onClick={() => onNavigate("orcamento")}>
        <FaChartPie />
        <span>Orçamento</span>
      </MenuItem>

      <MenuItem isOpen={isOpen} onClick={onLogout}>
        <FaSignOutAlt />
        <span>Sair</span>
      </MenuItem>
    </SidebarContainer>
  );
}

export default Sidebar;
