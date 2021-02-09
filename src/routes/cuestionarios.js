const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/agregar', (req, res) => {
    res.render('cuestionarios/agregar');
});

router.post('/agregar', async (req, res) => {
    const { nombre, num_preguntas, descripcion } = req.body;
    const newLink = {
        nombre,
        num_preguntas,
        descripcion,
        id_usuario: req.user.id
    };
    await pool.query('INSERT INTO cuestionarios set ?', [newLink]);
    req.flash('success', 'Cuestionario Creado Exitosamente');
    res.redirect('/cuestionarios');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM cuestionarios WHERE id_usuario = ?', [req.user.id]);
    res.render('cuestionarios/listar', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM cuestionarios WHERE ID = ?', [id]);
    req.flash('success', 'Cuestionario Eliminado Exitosamente');
    res.redirect('/cuestionarios');
});

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM cuestionarios WHERE id = ?', [id]);
    console.log(links);
    res.render('cuestionarios/editar', {link: links[0]});
});

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, num_preguntas} = req.body; 
    const newLink = {
        nombre,
        descripcion,
        num_preguntas
    };
    await pool.query('UPDATE cuestionarios set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Cuestionario Modificado Exitosamente');
    res.redirect('/cuestionarios');
});

module.exports = router;