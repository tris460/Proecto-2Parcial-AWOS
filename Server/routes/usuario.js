const express = require('express');
const _= require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res){
    let desde = req.query.desde || 0; //empezando de cual
    let hasta = req.query.hasta || 5; //cuántos tomar

    Usuario.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(hasta))
    .exec((err, usuarios) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al momento de consultar',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Lista de usuarios obtenida con éxito',
            conteo: usuarios.length,
            usuarios
        });
    });
});


app.post('/usuario', function(req, res){
    let body = req.body;
    let usr = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password
    });

    usr.save((err, usrDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Usuario insertado con éxito',
            usrDB
        });
    });
});

app.put('/usuario/:id', function(req, res){
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email']);
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, usrDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al momento de actualizar',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Usuario actualizado con éxito',
            usuario: usrDB
        });
    });
});

app.delete('/usuario/:id', function(req, res){
    let id = req.params.id;
    res.json({
        ok: 200,
        mensaje: 'Usuario eliminado con éxito',
        id: id
    });
});

module.exports = app;