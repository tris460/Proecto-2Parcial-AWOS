const express = require('express');
const _ = require('underscore');
const app = express();
const Productos = require('../models/productos');

app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    Productos.find({})
    .skip(Number(desde)).limit(Number(hasta))
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al listar los productos',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Productos listados con éxito',
            conteo: productos.length,
            productos
        });
    });
});

app.post ('/producto', (req, res) => {
    let prod = new Productos({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        categoria: req.body.categoria,
        usuario: req.body.usuario
    });
    prod.save((err, prodDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Error al insertar un producto',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Producto insertado con éxito',
            prodDB
        });
    });
});

app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [ 'nombre', 'precioUni', 'categoria', 'disponible'])
    Productos.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, prodDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al actualizar',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'El producto fue actualizado con éxito',
            prodDB
        });
    });
});

app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    Productos.findByIdAndRemove(id, { context: 'query' }, (err, prodDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrio un error al tratar de eliminar un producto',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'El producto fue eliminado con éxito',
            prodDB
        });
    });
});

module.exports = app;