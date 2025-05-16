import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addSong } from "../api/songsApi";
import logo from "../assets/logo.webp";

interface HeaderProps {
  search: string;
  setSearch: (search: string) => void;
}

function Header({ search, setSearch }: HeaderProps) {
  const [showForm, setShowForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [lyrics, setLyrics] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/"); // Podrías agregar lógica para filtrar si no estás ya en /
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addSong({ title, artist, genre, lyrics });
      setTitle("");
      setArtist("");
      setGenre("");
      setLyrics("");
      setShowForm(false);
      navigate(0); // Recarga la página
    } catch (error) {
      console.error("Error al agregar canción:", error);
      alert("Hubo un error al guardar la canción.");
    }
  };

  return (
    <header
      className={`bg-white shadow sticky-top ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.5s ease", zIndex: 1050 }}
    >
      <div className="container py-3">
        <div className="row align-items-center g-2">
          {/* Logo */}
          <div className="col-auto">
            <img
              src={logo}
              alt="Acordes Criollos"
              style={{
                height: "50px",
                objectFit: "contain",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Campo de búsqueda */}
          <div className="col-md col-12">
            <form
              onSubmit={handleSearchSubmit}
              className="d-flex"
              role="search"
            >
              <input
                type="text"
                className="form-control me-2"
                placeholder="Buscar canciones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-danger" type="submit">
                Buscar
              </button>
            </form>
          </div>

          {/* Botón para abrir/cerrar formulario */}
          <div className="col-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn btn-outline-dark"
            >
              {showForm ? "Cerrar" : "Agregar"}
            </button>
          </div>
        </div>
      </div>

      {/* Formulario para agregar canción */}
      {showForm && (
        <div className="container my-3">
          <div className="card shadow">
            <div className="card-body">
              <form
                className="d-flex flex-column gap-3"
                onSubmit={handleAddSong}
              >
                <input
                  type="text"
                  placeholder="Título de la canción"
                  className="form-control"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Artista"
                  className="form-control"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Género"
                  className="form-control"
                  required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />

                <textarea
                  placeholder="Letra con acordes"
                  rows={5}
                  className="form-control"
                  required
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />

                <button type="submit" className="btn btn-danger">
                  Guardar Canción
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
