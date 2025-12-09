const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// === CORS GLOBAL ===
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// Middleware para asegurar headers CORS (Railway a veces cachea)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Body parser
app.use(express.json());

// === Conexión Mongo Railway ===
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Error Mongo:", err));

// Importar modelo
const Usuario = require("./models/Usuario");

// === Rutas ===
app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando con CORS habilitado");
});

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/usuarios", async (req, res) => {
    try {
        const nuevo = new Usuario(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/usuarios/:id", async (req, res) => {
    try {
        const editado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(editado);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/usuarios/:id", async (req, res) => {
    try {
        const eliminado = await Usuario.findByIdAndDelete(req.params.id);
        res.json(eliminado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === Puerto Railway ===
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en puerto ${PORT}`);
});

