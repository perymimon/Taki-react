import {Timer} from '../../common/Timer';
import {animePutCard, animeTakeCard} from '../utils/measuremens';
import {animate, random} from '../utils/utils';
import {responseToMessage} from './message-listener';


const {GAME_MODE, GAME_SETTING} = require('./../../common/game-consts');

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
const counterDown = new Timer(GAME_SETTING.TURN_COUNTER);

function toSec(timePass) {
    return Math.ceil((GAME_SETTING.TURN_COUNTER - timePass) / 1000);
}

export function storeStateActions(store, socket, actions) {

    counterDown.tick(function () {
        const timeLeft = toSec(counterDown.timePass);
        store.setState({timeLeft});
    }, 1000);

    global.$store = store;

    const addSeparator = debounce(store.action(function (state) {
        return {messages: ['separator', ...state.messages]}
    }), addSeparatorTimeout);

    socket.on(SOCKET_EVENTS.UPDATE_GAME_STATE, function (partialState) {
        if ('timeLeft' in partialState) {
            counterDown.sync(partialState.timeLeft);
            delete partialState.timeLeft;
        }

        store.setState(partialState);
        store.run.updateCurrentStage();
    });

    socket.on(SOCKET_EVENTS.INCOMING_MESSAGE, function (messages) {
        responseToMessage(messages, store, counterDown);
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

    console.log('restarted again');

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
                const player = Object.assign({}, state.player);
                player.hand.push(...cards);
                store.setState({player});
                for (let cardObj of cards) {
                    animeTakeCard(cardObj);
                }
            })
        },
        playCard(state, card, cardElement) {
            if (!isCardValid(state, card)) {
                animate(cardElement, 'shake');
            } else {
                const lay = {
                    rotate: random(-40, 40),
                    origin: [random(30, 70), random(30, 70)],
                };
                const stack = state.stack;
                stack.topCards.unshift({card, lay});
                store.setState({stack: Object.assign({}, stack)});
                animePutCard(cardElement);
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
