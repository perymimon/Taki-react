const {GAME_STAGE, SOCKET_EVENTS} = require('../../common/game-consts');
export const state = {
    isOnline: false,
    gameInProgress: false,
    player: {itHisTurn: false, hand: []},
    players: [],
    messages: [],
    stage: GAME_STAGE.PLAYER_SIGNIN,
};

export function storeContentActions(store, socket) {

    socket.on(SOCKET_EVENTS.UPDATE_GAME_STATE, function (partialState) {
        store.setState(partialState);
        store.run.updateCurrentStage();
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
        startGame(state) {
            socket.emit('start-game');
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

        updateCurrentStage(state) {
            if (state.playerInGame) {
                if (state.gameInProgress) {
                    store.setState({stage: GAME_STAGE.GAME_TABLE})
                } else {
                    store.setState({stage: GAME_STAGE.WELCOME})
                }
            } else {
                store.setState({stage: GAME_STAGE.PLAYER_SIGNIN});
            }
        },
    }
}
