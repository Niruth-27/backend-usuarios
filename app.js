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

app.use(express.json());

// === Conexión Mongo Railway ===
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB conectado en Railway"))
    .catch(err => console.error("Error de Mongo:", err));

// Importar modelo
const Usuario = require("./models/Usuario");

// === Rutas ===
app.get("/", (req, res) => {
    res.json({ mensaje: "Backend funcionando correctamente" });
});

// Obtener todos
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener uno por ID
app.get("/usuarios/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (err) {
        res.status(400).json({ error: "ID inválido" });
    }
});

// Crear usuario
app.post("/usuarios", async (req, res) => {
    try {
        const nuevo = new Usuario(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Actualizar usuario
app.put("/usuarios/:id", async (req, res) => {
    try {
        const editado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!editado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(editado);
    } catch (err) {
        res.status(400).json({ error: "ID inválido o datos incorrectos" });
    }
});

// Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const eliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario eliminado", eliminado });
    } catch (err) {
        res.status(400).json({ error: "ID inválido" });
    }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor encendido en puerto ${PORT}`);
});
