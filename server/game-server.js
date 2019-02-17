const debounce = require('lodash/debounce');
const Game = require('./game');
const Lobby = require('./lobby');
const socketIO = require('socket.io');
const Users = require('./user');
const {SOCKET_EVENTS, GAME_EVENTS} = require('../common/game-consts');

/* start logic */
module.exports = function (io) {
    let messages = [];
    const game = /* new */Game();
    const lobby = new Lobby(game);

    function sockets(roomName) {
        // return Object.values(io.socket.clients().sockets);
        const sockets = io.socket.clients().sockets;
        const room = io.socket.of('').adapter.rooms[roomName];
        if (!room) return [];
        return Object.keys(room.sockets)
            .map(key => sockets[key]);
    }

    // game.joinPlayer(Users.letUser('a97a7eca', {name: 'pery'}));
    // game.joinPlayer(Users.letUser('c9e9ca9c', {name: 'poron'}));
    // game.joinPlayer(Users.letUser('97ce7a97', {name: 'doron'}));

    const emitGameState = debounce(function emitClientsState() {
        sockets('game').forEach(updatingGameState);
        // emitLobbyState();
    }, 200);

    const emitLobbyState = debounce(function emitClientsState() {
        sockets('lobby').forEach(updatingLobbyState);
    }, 200);

    const emitGameMessages = debounce(function (player$messages) {
        sockets('game').forEach(function (socket) {
            const token = socket.token;
            const player = game.getPlayer(token);
            messages = player$messages.get(player);
            if (messages && messages.length)
                socket.emit(SOCKET_EVENTS.INCOMING_MESSAGE, messages);
        });
        game.flushMessages();
    }, 10);

    lobby.on(GAME_EVENTS.STATE_UPDATE, emitLobbyState);

    game.on(GAME_EVENTS.STATE_UPDATE, emitGameState);

    game.on(GAME_EVENTS.OUTGOING_MESSAGE, emitGameMessages);

    function updatingGameState(socket) {
        const token = socket.token;
        const playerState = game.getPlayerState(token);
        socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, playerState);
    }

    function updatingLobbyState(socket) {
        const token = socket.token;
        const userState = lobby.getUserState(token);
        socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, userState)
    }

    io.on(SOCKET_EVENTS.CONNECTION, (ctx, data) => {
        // ctx.token = ctx.socket.handshake.query.token;//todo: open issue for un consist
        const token = ctx.socket.token;
        const user = Users.letUser(token);
        user.connect(ctx.socket);
        console.log(
            `${token}: ${user.name || 'anonymous'} connected to room ${user.room || '"no room"'}`,
        );
        if (user.room === 'game') {
            updatingGameState(ctx.socket);
        }
        if (user.room === 'lobby') {
            updatingLobbyState(ctx.socket);
        }

    });

    Users.on(SOCKET_EVENTS.OFFLINE, function (user) {
        emitGameState();
        emitLobbyState();
    });
    Users.on(SOCKET_EVENTS.ONLINE, function (user) {
        emitGameState();
        emitLobbyState();
    });

    Users.on(SOCKET_EVENTS.DISCONNECT, function (user) {
        console.log(
            `${user.token}: ${user.name || '\banonymous'} left `,
        );
        // user.moveRoom('lobby');
        // game.exitPlayer(user.token);
    });

    io.on(SOCKET_EVENTS.DISCONNECT, (ctx) => {
        const token = ctx.socket.token;
        const user = Users.letUser(token);
        console.log(
            `${token}: ${user.name || '\banonymous'} disconnected`,
        );
        user.disconnect(ctx.socket.socket);

    });

    io.on(SOCKET_EVENTS.LOGIN, (ctx, data) => {
        const player = Users.letUser(ctx.token, data);
        player.moveRoom('lobby');
        lobby.join(player);
        console.log(
            `${player.token}: ${player.name || '\banonymous'} join lobby`,
        );
        // ctx.socket.emit(SOCKET_EVENTS.LOGGED_IN);
    });

    function joinGame(ctx, data) {
        const player = Users.letUser(ctx.token, data);
        player.moveRoom('game');
        console.log(
            `${player.token}: ${player.name || '\banonymous'} join game`,
        );
        game.joinPlayer(player);
    }

    io.on(SOCKET_EVENTS.JOIN_GAME, joinGame);

    io.on(SOCKET_EVENTS.LOGOUT, (ctx, data) => {
        game.exitPlayer(ctx.token);
        Users.removeUser(ctx.token);
    });

    // io.on(SOCKET_EVENTS.DISCONNECT, (ctx) =>{
    //        TODO:solve refresh issue
    //     game.exitPlayer(ctx.token);
    // });

    io.on(SOCKET_EVENTS.START_GAME, (ctx, data) => {
        joinGame(ctx, data);
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


