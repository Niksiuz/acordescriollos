import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { songs } from "../data/songs";
import { transposeLyrics } from "../utils/transpose";
import ChordDiagram from "../components/ChordDiagram";
import { SongType } from "../types/Song";
import { toast } from "react-hot-toast";

function Song() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<SongType | null>(null);

  const [tone, setTone] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLyrics, setEditedLyrics] = useState("");

  // Buscar canción primero en localStorage y después en songs originales
  useEffect(() => {
    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const foundCustomSong = customSongs.find((s) => s.id === Number(id));
    if (foundCustomSong) {
      setSong(foundCustomSong);
      return;
    }

    const foundSong = songs.find((s) => s.id === Number(id));
    if (foundSong) {
      setSong(foundSong);
    }
  }, [id]);

  // Auto Scroll
  useEffect(() => {
    let scrollInterval: ReturnType<typeof setInterval>;

    if (isScrolling) {
      scrollInterval = setInterval(() => {
        window.scrollBy(0, 1);
      }, 10);
    }

    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  if (!song) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-red-800">
          Canción no encontrada
        </h2>
      </div>
    );
  }

  const handleTranspose = (step: number) => {
    setTone((prevTone) => prevTone + step);
  };

  const handleSaveEdit = () => {
    if (!song) return;

    const updatedSong = { ...song, lyrics: editedLyrics };
    setSong(updatedSong);

    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const filteredSongs = customSongs.filter((s) => s.id !== song.id);

    localStorage.setItem(
      "customSongs",
      JSON.stringify([...filteredSongs, updatedSong])
    );

    setIsEditing(false);
    toast.success("¡Canción guardada correctamente!");
  };

  const handleDeleteSong = () => {
    const customSongs: SongType[] = JSON.parse(
      localStorage.getItem("customSongs") || "[]"
    );

    const updatedCustomSongs = customSongs.filter((s) => s.id !== song.id);
    localStorage.setItem("customSongs", JSON.stringify(updatedCustomSongs));

    toast.success("¡Canción eliminada!");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const chordsUsed = Array.from(
    new Set(
      song.lyrics.match(/\b[A-G][#b]?(m|maj7|m7|7|sus4|dim|aug)?\b/g) || []
    )
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4 text-red-800">{song.title}</h2>
      <h3 className="text-xl font-semibold mb-6 text-red-600">{song.artist}</h3>

      {/* 🎛 Botones de control */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => handleTranspose(-1)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          -1 Tono
        </button>
        <button
          onClick={() => handleTranspose(1)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          +1 Tono
        </button>
        <button
          onClick={() => setIsScrolling(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ▶️ Auto Scroll
        </button>
        <button
          onClick={() => setIsScrolling(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⏸️ Pausar
        </button>
        <button
          onClick={() => {
            setIsEditing(true);
            setEditedLyrics(song.lyrics);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          ✏️ Editar Letra
        </button>
        <button
          onClick={handleDeleteSong}
          className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded"
        >
          🗑️ Borrar Canción
        </button>
      </div>

      {/* 🎼 Área de edición */}
      {isEditing ? (
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-800">
          <textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={10}
          />
          <button
            onClick={handleSaveEdit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            💾 Guardar Cambios
          </button>
        </div>
      ) : (
        <pre
          className="bg-white p-4 rounded-lg shadow-md text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: transposeLyrics(song.lyrics, tone),
          }}
        />
      )}

      {/* 🎸 Diagramas de acordes */}
      {chordsUsed.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4 text-red-800">
            Diagramas de acordes:
          </h3>
          <div className="flex flex-wrap gap-6">
            {chordsUsed.map((chord) => (
              <ChordDiagram key={chord} chord={chord} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Song;
