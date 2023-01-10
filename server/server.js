// loads environment variables from a .env file into process.env
import * as dotenv from 'dotenv'

import http from 'node:http'
import express from "express"
import path from "node:path"
import {Server} from 'socket.io'

dotenv.config()
export var app = express();

export const httpServer = http.createServer(app);
const serverPort = process.env.SERVER_PORT;

export const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: 'GET,PUT,POST,DELETE,OPTIONS'.split(','),
        credentials: true
    },
    cookie: {
        name: "game-token",
        path: "/",
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, /*10 years*/
        httpOnly: false,
        sameSite: "lax"
    }
});
// called for each HTTP request (including the WebSocket upgrade)
io.engine.on("headers", (headers, request) => {
    if (!request.headers.cookie) return;
    // const cookies = parse(request.headers.cookie);
    // if (!cookies.randomId) {
    //     headers["set-cookie"] = serialize("randomId", "abc", { maxAge: 86400 });
    // }
});
io.on('connection', socket => {


});

app.use(express.static(path.resolve('public/.dist'), {extensions: ['html']}));
app.use(express.static(path.resolve('public'), {extensions: ['html']}));
app.use(express.static(path.resolve('bower_components')));
app.use(express.static(path.resolve('node_modules')));

app.get('/', (req, res) => {
    // res.send('server up')
    res.send('public/.dist/index.html');
})
httpServer.listen(serverPort, () => {
    console.log(`server listening on port ${serverPort}`)
})

