const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Railway asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;

// Middlewares
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json());


// Conexión a MongoDB usando la variable de entorno de Railway
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB en Railway"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Importar el modelo
const Usuario = require("./models/Usuario");

// Ruta principal
app.get("/", (req, res) => {
  res.send("🚀 Servidor desplegado correctamente en Railway y conectado a MongoDB.");
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
    res.status(500).send("Error al buscar usuario");
  }
});

// Actualizar usuario (UPDATE)
app.put("/usuarios/:id", async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    res.status(500).send("Error al actualizar usuario");
  }
});

// Eliminar usuario (DELETE)
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
    res.status(500).send("Error al eliminar usuario");
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});




