const PORT = 8080;
/*basic*/
const path = require('path');
const http = require('http');
/*build client*/
// require('./parcel');
/*extra*/
// const socket = require('socket.io');
const Koa = require('koa');
const IO = require('koa-socket');
const app = new Koa();
const lobbyIO = new IO();

lobbyIO.attach(app); // Socket is now available as app.io if you prefer

app.keys = ["some key loop", "another key loop"];

app.use(function resetCookieToken(ctx, next){
    const tokenName = 'game-token';
    const token = ctx.cookies.get(tokenName) || createToken();
    ctx.cookies.set(tokenName, token, {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, /*10 years*/
        httpOnly: false,
        overwrite: true
    });
    return next();
});

app.use(require('koa-static')(path.resolve('public/.dist'), {extensions: ['html']}));
app.use(require('koa-static')(path.resolve('public'), {extensions: ['html']}));
app.use(require('koa-static')(path.resolve('bower_components')));
app.use(require('koa-static')(path.resolve('node_modules')));
app.use(async function (ctx) {
    const send = require('koa-send');
    await send(ctx, 'public/dist/index.html');
});
// app.use(require('koa-bodyparser')());
// app.use(require('koa-session')({secret: 'keyboard cat',resave:true,saveUninitialized: true}, app));

lobbyIO.use( (ctx,next ) => {
    ctx.token = ctx.socket.socket.handshake.query.token;
    return next();
});

lobbyIO.on('connection', function (sock, data) {
    // console.log('connected');
});

require('./game-server')(lobbyIO,app);

app.listen(process.env.PORT || PORT, function () {
    console.log('Server listening at port %d', PORT);
});


/*middleware*/
function createToken() {
    return Array(8).fill(null).map(_ => '67890abcdef'[(Math.random() * 10) | 1]).join('');
}
