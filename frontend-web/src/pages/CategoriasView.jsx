import { useEffect, useState } from "react";

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoLimite, setNovoLimite] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/categorias", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Erro ao carregar categorias:", err));
  }, []);

  const handleSalvar = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ limite: parseFloat(novoLimite) }),
      });

      if (res.ok) {
        const novasCategorias = categorias.map(cat =>
          cat.id === id ? { ...cat, limite: parseFloat(novoLimite) } : cat
        );
        setCategorias(novasCategorias);
        setEditando(null);
        setNovoLimite("");
      }
    } catch (err) {
      console.error("Erro ao atualizar limite:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Categorias</h2>
      <ul>
        {categorias.map((cat) => (
          <li key={cat.id} style={{ marginBottom: "1rem" }}>
            <strong>{cat.nome}:</strong>{" "}
            {editando === cat.id ? (
              <>
                <input
                  type="number"
                  value={novoLimite}
                  onChange={(e) => setNovoLimite(e.target.value)}
                />
                <button onClick={() => handleSalvar(cat.id)}>Salvar</button>
                <button onClick={() => setEditando(null)}>Cancelar</button>
              </>
            ) : (
              <>
                R$ {cat.limite ?? "Sem limite"}
                <button onClick={() => {
                  setEditando(cat.id);
                  setNovoLimite(cat.limite ?? "");
                }}>Editar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriasPage;
