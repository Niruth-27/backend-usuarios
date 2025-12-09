const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// === CORS CONFIGURACIÓN ===
app.use(cors({
    origin: "*",            // Permite cualquier origen
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));

// === Middleware ===
app.use(express.json());

// === Conexión Mongo ===
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("Error de Mongo:", err));

// === Modelo ===
const Usuario = require('./Usuario');

// === Rutas ===

// Obtener usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// Crear usuario
app.post('/usuarios', async (req, res) => {
    try {
        const nuevo = new Usuario(req.body);
        await nuevo.save();
        res.json({ mensaje: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

// Editar usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndUpdate(req.params.id, req.body);
        res.json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// Eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// Puerto Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));



