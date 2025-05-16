import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Song from "./pages/Song";
import ArtistPage from "./pages/ArtistPage";

function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-amber-50">
        {/* Encabezado con búsqueda */}
        <Header search={search} setSearch={setSearch} />

        {/* Rutas principales */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/song/:id" element={<Song />} /> {/* Ruta dinámica */}
            <Route path="/artist/:artistName" element={<ArtistPage />} />
          </Routes>
        </main>

        {/* Pie de página */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
