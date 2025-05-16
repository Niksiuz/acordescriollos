from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os


app = Flask(__name__)
CORS(app)

SONGS_FILE = os.path.join("api", "songs", "songs.json")

# Ruta para analizar texto
@app.route("/analizar", methods=["POST"])
def analizar():
    try:
        data = request.get_json(force=True)
        texto = data.get("texto", "")
        acordes_detectados = f"Acorde simulado para: {texto}"
        return jsonify({"acordes": acordes_detectados})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Obtener todas las canciones
@app.route("/api/songs", methods=["GET"])
def get_songs():
    try:
        if not os.path.exists(SONGS_FILE):
            return jsonify([])  # Devolver lista vacía si no existe el archivo

        with open(SONGS_FILE, "r", encoding="utf-8") as f:
            songs = json.load(f)
        return jsonify(songs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Agregar una nueva canción
@app.route("/api/songs", methods=["POST"])
def add_song():
    try:
        new_song = request.get_json(force=True)

        required_fields = {"title", "artist", "genre", "lyrics"}
        if not required_fields.issubset(new_song):
            return jsonify({"error": "Faltan campos requeridos"}), 400

        # Crear archivo si no existe
        if not os.path.exists(SONGS_FILE):
            os.makedirs(os.path.dirname(SONGS_FILE), exist_ok=True)
            with open(SONGS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

        with open(SONGS_FILE, "r+", encoding="utf-8") as f:
            try:
                songs = json.load(f)
            except json.JSONDecodeError:
                songs = []

            new_song["id"] = max((s.get("id", 0) for s in songs), default=0) + 1
            songs.append(new_song)

            f.seek(0)
            json.dump(songs, f, indent=2, ensure_ascii=False)
            f.truncate()

        return jsonify({"song": new_song}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
