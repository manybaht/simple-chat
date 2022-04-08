const fastify = require('fastify');
const { readFileSync } = require('fs');

const app = fastify();

app.register(require('fastify-socket.io'));

app.get('/', (request, reply) => {
    const data = readFileSync('./index.html');
    reply.header('Content-Type', 'text/html; charset=utf-8');
    reply.send(data);
});

app.ready(err => {
    if (err) console.error(err);

    app.io.on('connection', socket => {
        socket.emit('message', {
            message: 'Connected.'
        });

        socket.on('message', message => {
            console.log(message);
            socket.broadcast.emit('message', message);
        });
    });
});

app.listen(8080);