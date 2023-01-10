import debounce from 'lodash/debounce.js';
import {Game} from './game.js';
import {Lobby} from './lobby.js';
import {User as Users} from './user.js';
import {SOCKET_EVENTS, GAME_EVENTS} from '../common/game-consts.js';

// game.joinPlayer(Users.letUser('a97a7eca', {name: 'pery'}));
// game.joinPlayer(Users.letUser('c9e9ca9c', {name: 'poron'}));
// game.joinPlayer(Users.letUser('97ce7a97', {name: 'doron'}));

/* start logic */
export function GameServer(io) {
    let messages = [];
    const game = /* new */Game();
    const lobby = new Lobby(game);

    function roomSockets(roomName) {
        const socketIds = io.sockets.adapter.rooms.get(roomName) || new Set();
        return Array.from(socketIds).map(key => io.sockets.sockets.get(key));
    }

    io.use((socket, next) => {
        const token = socket.handshake.headers["session-token"];
        const user = Users.letUser(token);
        user.connect(socket);
        socket.token = token;
        socket.user = user;
        console.log(`${user.token}: ${user.name || 'anonymous'} connected to room ${user.room || '"no room"'}`);
        next();
    })
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        const {user} = socket;

        if (user.room === 'game') {
            // updatingGameState(socket);
            const playerState = game.getPlayerState(user);
            socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, playerState);
        }
        if (user.room === 'lobby') {
            // updatingLobbyState;
            const userState = lobby.getUserState(user);
            socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, userState)
        }

        // socket.use(async (event, next) => {
        //     await next();
        //     emitGameState();
        //     emitLobbyState();
        // })
        socket.on(SOCKET_EVENTS.LOGIN, (userForm) => {
            const player = Users.letUser(user.token, userForm);
            lobby.join(player);
            // updatingLobbyState;
            const userState = lobby.getUserState(user.token);
            socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, userState)
            console.log(`${player.token}: ${player.name || '\banonymous'} join lobby`);
        });

        io.on(SOCKET_EVENTS.JOIN_GAME, (data) => {
            game.joinPlayer(user);
            console.log(`${user.token}: ${user.name || '\banonymous'} join the game`);
        });

        socket.on(SOCKET_EVENTS.LOGOUT, (data) => {
            game.exitPlayer(user.token);
            Users.removeUser(user.token);
        });

        socket.on(SOCKET_EVENTS.DISCONNECT, (data) => {
            // TODO:solve refresh issue
            // game.exitPlayer(data.token);
            console.log(`${user.token}: ${user.name || 'anonymous'} disconnected to room ${user.room || '"no room"'}`);
        });

        socket.on(SOCKET_EVENTS.START_GAME, (data) => {
            game.joinPlayer(user);
            game.setup({rounds: data.rounds});
            console.log(`${user.token}: ${user.name || '\banonymous'} join and start the game`);
        });

        socket.on(SOCKET_EVENTS.RESET_GAME, () => game.reset());

        socket.on('action:play-card', ({card}, acknowledge) => {
            const isSuccess = game.playCard(user, card);
            acknowledge(isSuccess);
        });

        socket.on('action:draw-card', ({amount} = {}, acknowledge) => {
            const cards = game.drawCards(user, amount);
            acknowledge(cards);
        });

        socket.on('action:end-turn', (data, acknowledge) => {
            game.endTurn(socket.token);
        });

        socket.on('action:select-color', ({color: colorSelected}, acknowledge) => {
            game.selectColor(colorSelected);
        })


    });

    io.on(SOCKET_EVENTS.DISCONNECT, (socket) => {
        const token = socket.token;
        const user = Users.letUser(token);
        console.log(
            `${token}: ${user.name || '\banonymous'} disconnected`,
        );
        user.disconnect(socket);

    });
    const broadcastGameState = debounce(function emitClientsState() {
        roomSockets('game').forEach( socket=>{
            const playerState = game.getPlayerState(socket.token);
            socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, playerState);
        });
    }, 200);
    const broadcastLobbyState = debounce(function emitClientsState() {
        roomSockets('lobby').forEach( socket=>{
            const userState = lobby.getUserState(socket.token);
            socket.emit(SOCKET_EVENTS.UPDATE_GAME_STATE, userState)
        });
    }, 200);

    const emitGameMessages = debounce(function (player$messages) {
        roomSockets('game').forEach(function (socket) {
            const token = socket.token;
            const player = game.getPlayer(token);
            messages = player$messages.get(player);
            if (messages && messages.length)
                socket.emit(SOCKET_EVENTS.INCOMING_MESSAGE, messages);
        });
        game.flushMessages();
    }, 10);

    lobby.on(GAME_EVENTS.STATE_UPDATE, broadcastLobbyState);
    game.on(GAME_EVENTS.STATE_UPDATE, broadcastGameState);
    game.on(GAME_EVENTS.OUTGOING_MESSAGE, emitGameMessages);
    Users.on(SOCKET_EVENTS.OFFLINE, function (user) {
        broadcastGameState();
        broadcastLobbyState();
    });

    Users.on(SOCKET_EVENTS.ONLINE, function (user) {
        broadcastGameState();
        broadcastLobbyState();
    });

    Users.on(SOCKET_EVENTS.DISCONNECT, function (user) {
        console.log(
            `${user.token}: ${user.name || '\banonymous'} left `,
        );
        // user.moveRoom('lobby');
        // game.exitPlayer(user.token);
    });
};