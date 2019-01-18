import {measurementPutCard, measurementTakeCard} from '../utils/measuremens';
import {animate, random} from '../utils/utils';
import {responseToMessage} from './message-listener';

const {GAME_MODE} = require('./../../common/game-consts');

const {isCardValid} = require('../../common/common-methods');

const {GAME_STAGE, SOCKET_EVENTS} = require('../../common/game-consts');
const debounce = require('lodash/debounce');

const addSeparatorTimeout = 1000;

export const state = {
    isOnline: false,
    gameInProgress: false,
    player: {itHisTurn: false, hand: []},
    players: [],
    messages: [],
    stage: GAME_STAGE.PLAYER_SIGNIN,
    timeLeft: 0,
    stackLay: [],
    stack: {
        topCards: [],
    },

};

export function storeStateActions(store, socket, actions) {

    global.$store = store;

    const addSeparator = debounce(store.action(function (state) {
        return {messages: ['separator', ...state.messages]}
    }), addSeparatorTimeout);

    socket.on(SOCKET_EVENTS.UPDATE_GAME_STATE, function (partialState) {
        store.setState(partialState);
        store.run.updateCurrentStage();
    });

    socket.on(SOCKET_EVENTS.INCOMING_MESSAGE, function (messages) {
        responseToMessage(messages, store);

        var state = store.getState();
        store.setState({messages: [...messages, ...state.messages]});
        addSeparator()
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
        /*UTIL ACTIONS*/
        /* not put util here , it not return values*/

        /*PRE GAME ACTIONS*/
        login(state, data) {
            socket.emit('login', data);
        },
        startGame(state) {
            socket.emit('start-game');
        },
        readyToPlay() {

        },

        /* player game action */
        drawCards(state) {
            socket.emit('action:draw-card', {}, function (cards) {
                const player = Object.assign({},state.player);
                player.hand.push(...cards);
                store.setState({player:player});
                requestAnimationFrame(function () {
                    for (let cardObj of cards) {
                        const card = document.getElementById(cardObj.id);
                        measurementTakeCard(card);
                    }
                });
            })
        },
        playCard(state, card, cardElement) {
            const lay = {
                rotate: random(-40, 40),
                origin: [random(30, 70), random(30, 70)],
            };
            if (!isCardValid(state, card)) {
                animate(cardElement, 'shake');
            } else {
                const stack = state.stack;
                stack.topCards.unshift({card, lay});

                store.setState({stack: Object.assign({}, stack)});

                requestAnimationFrame(function () {
                    measurementPutCard(cardElement);
                })
            }

            socket.emit('action:play-card', {card, lay}, function (isSuccess) {

            });
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
