require('dotenv').config();
const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const { connect } = require('./database');
const ArticleModel = require('./schemas/article');
const UserModel = require('./schemas/user');

connect();

const app = express();

app.use(express.json());

const jwtValidation = (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.status(401).json({
            message: 'No hay token'
        });
        return
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (e) {
        res.status(401).json({
            message: 'Token inválido'
        });
    }
}

app.get('/', (req, res) => {
    res.send(`Hello World`);
});

app.get('/api/articles', async (req, res) => {
    const articles = await ArticleModel.find().populate('author').exec()
    res.json(articles);
});

app.post('/api/users', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const document = await new UserModel({ email, username, password: md5(password) }).save();
        res.status(201).json(document);
    } catch (e) {
        res.status(401).json({
            'message': e
        });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            res.status(404).json({
                message: 'Correo electronico incorrecto'
            });
        } else {
            const md5Password = md5(password);
            if (md5Password === user.password) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                res.json({ token });
            } else {
                res.status(400).json({
                    message: 'Contraseña incorrecta'
                });
            }
        }
    } catch (e) {
        res.status(401).json({
            'message': e
        });
    }
});

app.post('/api/articles', jwtValidation, async (req, res) => {
    const { id } = req.user;
    const { title, description, body, tagList } = req.body;
    try {
        const document = await new ArticleModel({
            title,
            description,
            body,
            tagList,
            author: id
        }).save();

        res.status(201).json(document);
    } catch (e) {
        res.status(401).json({
            'message': e
        });
    }
});

app.get('/api/articles/feed', jwtValidation, async (req, res) => {
    const { id } = req.user;
    try {
        const articles = await ArticleModel.find({ author: id }).populate('author').exec();
        res.json(articles);
    } catch (e) {
        res.status(400).json({
            'message': e
        });
    }
})

app.listen(8080, () => {
    console.log('> Escuchando puerto 8080');
});