import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Song from "./pages/Song";
import ArtistPage from "./pages/ArtistPage";

function App() {
  const [search, setSearch] = useState<string>("");

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light">
        {/* Encabezado con campo de búsqueda */}
        <Header search={search} setSearch={setSearch} />

        {/* Contenido principal */}
        <main className="flex-grow-1 container py-4">
          <Routes>
            <Route path="/" element={<Home search={search} />} />
            <Route path="/song/:id" element={<Song />} />
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
