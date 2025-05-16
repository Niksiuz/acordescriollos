const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));

app.post("/analizar", async (req, res) => {
  // Aquí deberías portar tu lógica de análisis desde Python a JS
  res.json({ acordes: "Acorde simulado" });
});

exports.api = functions.https.onRequest(app);
