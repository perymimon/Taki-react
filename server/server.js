/*basic*/
const path = require('path');
const http = require('http');
const socketCookies = require('./socket-cookie');

require('dotenv').config();
/*build client*/
// require('./parcel');
/*extra*/
// const socket = require('socket.io');
const Koa = require('koa');
const route = require('koa-route');
const IO = require('koa-socket');
const app = new Koa();
const lobbyIO = new IO();

lobbyIO.attach(app); // Socket is now available as app.io if you prefer

app.keys = ["some key loop", "another key loop"];

// app.use(function resetCookieToken(ctx, next){
//     const tokenName = 'game-token';
//     const token = ctx.cookies.get(tokenName) || createToken();
//     ctx.cookies.set(tokenName, token, {
//         maxAge: 10 * 365 * 24 * 60 * 60 * 1000, /*10 years*/
//         httpOnly: false,
//         overwrite: true
//     });
//     return next();
// });


app.use(require('koa-static')(path.resolve('public/.dist'), {extensions: ['html']}));
app.use(require('koa-static')(path.resolve('public'), {extensions: ['html']}));
app.use(require('koa-static')(path.resolve('bower_components')));
app.use(require('koa-static')(path.resolve('node_modules')));

app.use(function (ctx, next) {
    ctx.response.set("Access-Control-Allow-Origin", '*');
    ctx.response.set("Access-Control-Allow-Credentials", true);
    ctx.response.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    ctx.response.set("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use(function (ctx, next) {
    console.log(ctx.url);
    next();
});

app.use(route.get('/ping', function (ctx) {
    ctx.body = 'pong';
}));

app.use(route.get('/register', function (ctx) {
    const tokenName = 'game-token';
    const token = ctx.cookies.get(tokenName) || createToken();
    const maxAge = 10 * 365 * 24 * 60 * 60 * 1000 /*10 years*/;
    const expires = new Date(Date.now() + maxAge);
    // ctx.cookies.set(tokenName, token, {
    //     maxAge: 10 * 365 * 24 * 60 * 60 * 1000, /*10 years*/
    //     httpOnly: false,
    //     overwrite: true,
    //     // domain:'netlify.com',
    //     // sameSite:'Lax'
    //     // secure:false
    // });
    ctx.set("Access-Control-Allow-Origin", process.env.ORIGIN_CLIENT );
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Set-Cookie', `game-token=${token}; path=/; expires=${expires.toUTCString()}`);
    ctx.body = token;
}));

app.use(async function (ctx) {
    const send = require('koa-send');
    await send(ctx, 'public/.dist/index.html');
});
// app.use(require('koa-bodyparser')());
app.use(require('koa-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true}, app));

lobbyIO.use((ctx, next) => {
    // ctx.token = ctx.socket.socket.handshake.query.token;
    // const cookief  = ctx.socket.handshake.headers.cookie;
    // ctx.token = cookief.replace(/.*token=(\w+).*/, '$1');
    ctx.token = ctx.socket.socket.token;

    if (!ctx.token) {
        return next(new Error('not registered, call `http get /register` '))
    }
    return next();
});

lobbyIO.on('connection', function (ctx, data) {
    const tokenName = 'game-token';
    const cookie = socketCookies(ctx.socket);
    const token = cookie.get(tokenName);
    // cookie.set(tokenName, token, 10 * 365 /*10 years*/);
    ctx.socket.token = ctx.data.token = token;
});

require('./game-server')(lobbyIO, app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log('Server listening at port %d', PORT);
});


/*middleware*/
function createToken() {
    return Array(8).fill(null).map(_ => '67890abcdef'[(Math.random() * 10) | 1]).join('');
}
