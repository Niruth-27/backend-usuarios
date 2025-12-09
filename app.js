// ====== IMPORTS ======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ====== CONFIGURACIONES ======
const app = express();
app.use(express.json());

// 🔥 CORS PERMITIENDO TODO — PARA QUE EL FRONTEND FUNCIONE
app.use(cors({
    origin: "*",               // Permitir cualquier origen
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type"
}));

// ====== CONEXIÓN A MONGO ======
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log("Conectado a MongoDB correctamente"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// ====== SCHEMA & MODELO ======
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    edad: Number
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// ====== RUTAS ======

// GET TODOS LOS USUARIOS
app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

// POST CREAR USUARIO
app.post("/usuarios", async (req, res) => {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.json({ mensaje: "Usuario guardado correctamente", usuario });
});

// DELETE ELIMINAR USUARIO
app.delete("/usuarios/:id", async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
});

// ====== INICIAR SERVIDOR ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});



