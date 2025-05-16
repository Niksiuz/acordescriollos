import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addSong } from "../api/songsApi"; // ✅ Asegúrate de que esta ruta sea correcta
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSong({ title, artist, genre, lyrics });
    setTitle("");
    setArtist("");
    setGenre("");
    setLyrics("");
    setShowForm(false);
    navigate(0); // Recarga la página
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`bg-white shadow sticky-top ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.5s ease", zIndex: 1050 }}
    >
      <div className="container py-3">
        <div className="row align-items-center g-2">
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

      {showForm && (
        <div className="container my-3">
          <div className="card shadow">
            <div className="card-body">
              <form
                className="d-flex flex-column gap-3"
                onSubmit={handleAddSong}
              >
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Título de la canción"
                  className="form-control"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  id="artist"
                  name="artist"
                  type="text"
                  placeholder="Artista"
                  className="form-control"
                  required
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
                <input
                  id="genre"
                  name="genre"
                  type="text"
                  placeholder="Género"
                  className="form-control"
                  required
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />

                <textarea
                  id="lyrics"
                  name="lyrics"
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
