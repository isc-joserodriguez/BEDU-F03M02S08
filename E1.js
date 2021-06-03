const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`> ${req.get('User-Agent')}`)
    next();
})

app.get('/', (req, res) => {
    res.end('Hello World!');
});

app.get('/otra', (req, res) => {
    res.end('Otro Hello World!');
});

app.listen(8080, () => {
    console.log('> Escuchando puerto 8080');
});