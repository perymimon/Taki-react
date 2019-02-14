const debounce = require('lodash/debounce');
const Game = require('./game');
const Users = require('./user');
const {SOCKET_EVENTS, GAME_EVENTS} = require('../common/game-consts');

/* start logic */
module.exports = function (io) {
    let messages = [];
    const game = /* new */Game();

    function sockets() {
        return Object.values(io.socket.clients().sockets);
    }

    // game.joinPlayer(Users.letUser('a97a7eca', {name: 'pery'}));
    // game.joinPlayer(Users.letUser('c9e9ca9c', {name: 'poron'}));
    // game.joinPlayer(Users.letUser('97ce7a97', {name: 'doron'}));
    // game.setup();

    const emitGameState = debounce(function emitClientsState() {
        sockets().forEach(updatingGameState);
    }, 200);

    const emitGameMessages = debounce(function (player$messages) {
        sockets().forEach(function (socket) {
            const token = socket.token;
            const player = game.getPlayer(token);
            messages = player$messages.get(player);
            if (messages && messages.length)
                socket.emit(SOCKET_EVENTS.INCOMING_MESSAGE, messages);
        });
        game.flushMessages();
    }, 10);

    game.on(GAME_EVENTS.STATE_UPDATE, emitGameState);

    game.on(GAME_EVENTS.OUTGOING_MESSAGE, emitGameMessages);

    function updatingGameState(socket) {
        const token = socket.token;
        const playerState = game.getPlayerState(token);
        socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, playerState);
    }

    io.on(SOCKET_EVENTS.CONNECTION, (ctx, data) => {
        // ctx.token = ctx.socket.handshake.query.token;//todo: open issue for un consist
        const token = ctx.socket.token;
        const user = Users.letUser(token);
        user.connections.add(ctx.socket);
        // const player = game.getPlayer(token) || {};
        //
        console.log(
            `${token}: ${user.name || '\banonymous'} connected`,
        );

        updatingGameState(ctx.socket);
    });

    Users.on(SOCKET_EVENTS.DISCONNECT,function (user) {
        game.exitPlayer(user.token);
    });

    io.on(SOCKET_EVENTS.DISCONNECT, (ctx) => {

        const token = ctx.socket.token;
        const user = Users.letUser(token);
        user.disconnect(ctx.socket.socket);

    });

    io.on(SOCKET_EVENTS.LOGIN, (ctx, data) => {
        const player = Users.letUser(ctx.token, data);
        game.joinPlayer(player);
        // ctx.socket.emit(SOCKET_EVENTS.LOGGED_IN);
    });

    io.on(SOCKET_EVENTS.LOGOUT, (ctx, data) => {
        game.exitPlayer(ctx.token);
        Users.removeUser(ctx.token);
    });

    // io.on(SOCKET_EVENTS.DISCONNECT, (ctx) =>{
    //        TODO:solve refresh issue
    //     game.exitPlayer(ctx.token);
    // });

    io.on(SOCKET_EVENTS.START_GAME, (ctx, data) => {
        game.setup();
    });

    io.on(SOCKET_EVENTS.RESET_GAME, (ctx, data) => {
        game.reset();
    });


    io.on('action:play-card', (ctx, {card}) => {
        const isSuccess = game.playCard(ctx.token, card);
        ctx.acknowledge(isSuccess);
    });

    io.on('action:draw-card', (ctx, {amount} = {}) => {
        const cards = game.drawCards(ctx.token, amount);
        ctx.acknowledge(cards);
    });

    io.on('action:end-turn', (ctx) => {
        game.endTurn(ctx.token);
    });

    io.on('action:select-color', (ctx, {color: colorSelected}) => {
        game.selectColor(colorSelected);
    })


    // io.use(async (ctx, next) => {
    //     await next();
    //     updatingClientsGameState();
    // })

};


