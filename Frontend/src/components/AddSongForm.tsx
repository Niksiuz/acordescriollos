import { useState } from "react";
import { addSong, Song } from "../api/songsApi";

const AddSongForm = () => {
  const [formData, setFormData] = useState<Omit<Song, "id">>({
    title: "",
    artist: "",
    genre: "",
    lyrics: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevaCancion = await addSong(formData);
      console.log("🎉 Canción agregada:", nuevaCancion);
      alert("✅ Canción agregada correctamente");
      setFormData({ title: "", artist: "", genre: "", lyrics: "" });
    } catch (error) {
      alert("❌ Error al agregar canción");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Agregar Canción</h2>
      <input
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="artist"
        placeholder="Artista"
        value={formData.artist}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="genre"
        placeholder="Género"
        value={formData.genre}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="lyrics"
        placeholder="Letra"
        value={formData.lyrics}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar Canción
      </button>
    </form>
  );
};

export default AddSongForm;
