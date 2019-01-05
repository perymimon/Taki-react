const {GAME_STAGE} = require('../../common/game-consts');
export const state = {
    isOnline: false,
    gameInProgress: false,
    player: {itHisTurn: false, hand: []},
    players: [],
    messages: [],
    stage: GAME_STAGE.PLAYER_SIGNIN,
};

export function storeContentActions(store, socket) {

    socket.on('update-game-state', function (partialState) {
        store.setState(partialState);
    });

    socket.on('disconnect', function () {
        store.run.setOff('isOnline');
    });

    socket.on('reconnect', function () {
        store.run.setOn('isOnline');
    });

    socket.on('connect', function () {
        store.run.setOn('isOnline');
    });

    socket.on('logged-in', function () {
        store.setState({stage: GAME_STAGE.WELCOME})
    });
    console.log('some text');

    return {
        /* GENERAL ACTIONS */
        initialize(state, newState) {
            store.setState(newState, true/*replace state*/)
        },
        setOn(state, keyName) {
            return {[keyName]: true};
        },
        setOff(state, keyName) {
            return {[keyName]: false};
        },

        /*PREGAME ACTIONS*/
        login(state, data) {
            socket.emit('login', data);
        },
        startGame() {
            socket.emit('start');
        },
        readyToPlay() {

        },

        /* player game action */
        drawCards() {
            socket.emit('action:draw-card')
        },
        playCard(state, card, i) {
            card.i = i;
            socket.emit('action:play-card', {card});
        },
        endTurn() {
            socket.emit('action:end-turn');
        },
        selectColor(state, color) {
            socket.emit('action:select-color', {color});
        },
    }
}
