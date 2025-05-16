from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analizar", methods=["POST"])
def analizar():
    data = request.get_json()
    # Aquí va tu lógica de análisis con Python
    texto = data.get("texto", "")
    
    # Simulación de respuesta
    acordes_detectados = "Acorde simulado para: " + texto
    return jsonify({"acordes": acordes_detectados})

if __name__ == "__main__":
    app.run(debug=True)
