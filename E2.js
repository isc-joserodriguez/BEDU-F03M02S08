require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();

app.use(express.json());

const tokenExistance = ((req, res, next) => {
    const token = req.get('Authentication');
    if (!token) {
        res.status(401).json({
            message: 'Usuario sin sesión'
        });
    } else {
        next();
    }
});

const tokenValidation = ((req, res, next) => {
    const token = req.get('Authentication');
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (e) {
        res.status(401).json({
            message: 'El token de sesión es inválido'
        });
    }
});

app.get('/', [tokenExistance, tokenValidation], (req, res) => {
    const { nombre } = req.user;
    res.send(`Hello, ${nombre}`);
});

app.get('/token', (req, res) => {
    const token = jwt.sign({ id: 10, nombre: 'BEDU' }, process.env.JWT_SECRET)
    res.json({
        token: token
    });
});

app.listen(8080, () => {
    console.log('> Escuchando puerto 8080');
});