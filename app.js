import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Usuario from './Usuario.js';

const app = express();

// ------------------------------
// 🔥 CORS CONFIGURADO CORRECTAMENTE
// ------------------------------
app.use(cors({
    origin: "*",   // si quieres puedes poner solo tu dominio del front
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type"
}));

// Permite recibir JSON
app.use(express.json());

// ----------------------------
// 📌 CONEXIÓN A MONGODB RAILWAY
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado correctamente'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// ----------------------------
// 📌 RUTA PARA CREAR USUARIO
// ----------------------------
app.post('/usuarios', async (req, res) => {
    try {
        const nuevo = new Usuario(req.body);
        await nuevo.save();
        res.json({ mensaje: "Usuario guardado correctamente", usuario: nuevo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar usuario" });
    }
});

// ----------------------------
// 📌 OBTENER TODOS LOS USUARIOS
// ----------------------------
app.get('/usuarios', async (req, res) => {
    try {
        const lista = await Usuario.find();
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// ----------------------------
// 📌 INICIAR SERVIDOR
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando correctamente en puerto ${PORT}`);
});



