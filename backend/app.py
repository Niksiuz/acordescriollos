from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # permite solicitudes desde el frontend (Firebase)

@app.route('/analizar', methods=['POST'])
def analizar():
    data = request.get_json()
    # Simulación de procesamiento
    resultado = {'acordes': 'Acorde simulado'}
    return jsonify(resultado)

# Esto NO es necesario para Render:
# if __name__ == '__main__':
#     app.run()
