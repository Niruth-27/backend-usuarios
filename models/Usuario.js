const mongoose = require("mongoose");

// Esquema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  edad: { type: Number, required: true }
});

// Exportar el modelo
module.exports = mongoose.model("Usuario", usuarioSchema);
