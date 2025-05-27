import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";

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

  // Pega token do localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Buscar dados do perfil no backend
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

  // Atualiza preview da foto ao mudar fotoPerfil
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
        // Atualiza foto atual
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

  // ... aqui o restante do componente (renderização igual você já tinha)
}

export default EditarPerfil;
