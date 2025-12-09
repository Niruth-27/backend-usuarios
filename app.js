const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware CORS — PERMITE TODO
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// TOP FIX EXTRA — por si Railway cachea
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Body parser
app.use(express.json());

// Railway asigna puerto automático
const PORT = process.env.PORT || 3000;

// Mongo URI desde Railway
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error de conexión:", err));

// Modelo Usuario
const Usuario = require("./models/Usuario");

// RUTAS ==============================

app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando con CORS ACTIVO");
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor encendido en puerto ${PORT}`);
});


