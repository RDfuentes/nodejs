const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// REGISTRO
router.get('/registro', (req, res) => {
  res.render('auth/registro');
});

router.post('/registro', passport.authenticate('local.registro', {
  successRedirect: '/perfil',
  failureRedirect: '/registro',
  failureFlash: true
}));

// SINGIN
router.get('/inicio', (req, res) => {
  res.render('auth/inicio');
});

router.post('/inicio', (req, res, next) => {
  req.check('usuario', 'el usuario es requerido').notEmpty();
  req.check('contraseña', 'la contraseña es requerida').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/inicio');
  }
  passport.authenticate('local.inicio', {
    successRedirect: '/perfil',
    failureRedirect: '/inicio',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/perfil', isLoggedIn, (req, res) => {
  res.render('perfil');
});

module.exports = router;
