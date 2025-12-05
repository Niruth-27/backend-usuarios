const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 CONEXIÓN CORRECTA A MONGODB ATLAS
const MONGO_URI = "mongodb+srv://Niruth:InKVfcKjFJ77p2Ko@micluster.f7bmbnx.mongodb.net/miapp?retryWrites=true&w=majority&appName=miCluster";


// Conectar a MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Importar el modelo
const Usuario = require("./models/usuario");

// Ruta principal
app.get("/", (req, res) => {
  res.send("🚀 Servidor conectado a MongoDB Atlas");
});

// Crear un nuevo usuario (CREATE)
app.post("/usuarios", async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    res.json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevoUsuario
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los usuarios (READ)
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener usuarios");
  }
});

// Obtener un usuario por ID (READ por ID)
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar usuario por ID");
  }
});

// Actualizar un usuario por ID (UPDATE)
app.put("/usuarios/:id", express.json(), async (req, res) => {
  try {
    const { nombre, correo, edad } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, edad },
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar usuario");
  }
});

// Eliminar un usuario por ID (DELETE)
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
      usuario: usuarioEliminado
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar usuario");
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});



