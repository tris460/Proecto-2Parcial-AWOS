require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('<h1>Bienvenido a mi servidor REST</h1>');
});

app.use(require('./routes/usuario'));
app.use(require('./routes/categoria'));
app.use(require('./routes/login'))
app.use(require('./routes/productos'));

mongoose.connect('mongodb+srv://admin:Popoconbrillitos@cluster0.7kphc.mongodb.net/cafeteria', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, res) => {
    if(err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('El servidor está en línea en el puerto ', process.env.PORT);
});