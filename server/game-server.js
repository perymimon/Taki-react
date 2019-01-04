const debounce = require('lodash/debounce');
const Game = require('./game');
const Users = require('./user');
const {SOCKET_EVENTS,GAME_EVENTS} = require('../common/game-consts');


/* start logic */
module.exports = function (io) {
    let messages = [];
    const game = /*new */Game();

    // game.joinPlayer(Users.fetchUser('a97a7eca', {name: 'pery'}));
    // game.joinPlayer(Users.fetchUser('c9e9ca9c', {name: 'pery'}));
    // game.joinPlayer(Users.fetchUser('97ce7a97', {name: 'doron'}));
    // game.setup();

    const emitGameState = debounce(function emitClientsState() {
        const sockets = Object.values(io.socket.clients().sockets);
        sockets.forEach(updatingGameState);
        game.flushMessages();
    }, 200);

    game.on(GAME_EVENTS.INCOMING_MESSAGE, message => {
        messages.push(message);
        emitGameState();
    });

    game.on(GAME_EVENTS.GAME_STATE_UPDATE, emitGameState);

    function updatingGameState(socket) {
        const token = socket.handshake.query.token;
        socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, game.getUserState(token));
    }


    io.on(SOCKET_EVENTS.CONNECTION, (ctx, data) => {
        updatingGameState(ctx.socket);
    });

    io.on(SOCKET_EVENTS.LOGIN, (ctx, data) => {
        const player = Users.fetchUser(ctx.token, data);
        game.joinPlayer(player);
    });

    io.on(SOCKET_EVENTS.START_GAME, (ctx, data) => {
        game.setup();
    });

    io.on('action:play-card', (ctx, {card, extra = {}}) => {
        game.playCard(card, extra);
    });

    io.on('action:draw-card', (ctx, {amount} = {}) => {
        game.drawCards(amount);
    });

    io.on('action:end-turn', (ctx) => {
        game.endTurn();
    });

    io.on('action:select-color', (ctx, {color: colorSelected}) => {
        game.selectColor(colorSelected);
    })


    // io.use(async (ctx, next) => {
    //     await next();
    //     updatingClientsGameState();
    // })

};


