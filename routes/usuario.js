const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// GET - todos
router.get('/usuarios', async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

// GET - por ID
router.get('/usuarios/:id', async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
});

// POST - crear usuario
router.post('/crear-usuario', async (req, res) => {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: 'Usuario creado', usuario: nuevoUsuario });
});

// PUT - actualizar usuario
router.put('/usuarios/:id', async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el usuario',
            error: error.message
        });
    }
});

module.exports = router;
