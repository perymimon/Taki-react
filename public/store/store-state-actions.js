import {Timer} from '../../common/Timer';
import {animePutCards, animeTakeCards} from '../utils/measuremens';
import {animate, arrayDiff2, random} from '../utils/utils';
import {responseToMessage} from './message-listener';
import get from 'lodash/get';


const {isCardValid} = require('../../common/common-methods');

const {GAME_MODE, GAME_STAGE, SOCKET_EVENTS, GAME_SETTING} = require('../../common/game-consts');
const debounce = require('lodash/debounce');

export const initState = {
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
    let itInitializeState = true;

    store.subscribe(function stateToAction([newState, state], action) {
        const newHand = get(state, 'player.hand', []),
            oldHand = get(newState, 'player.hand', []);
        const {added, deleted} = arrayDiff2(newHand, oldHand, 'id');
        animeTakeCards(added, itInitializeState);
        /* can't be dane because card element is already gone
         animePutCards(deleted);*/
    });

    global.$store = store;

    let separatorCounter = 1;

    const addSeparator = debounce(store.action(function (state) {
        return {messages: [{code: 'separator', id: separatorCounter++}, ...state.messages]}
    }), GAME_SETTING.ADD_SEPARATOR_TIMEOUT);

    socket.on(SOCKET_EVENTS.UPDATE_GAME_STATE, function (partialState) {
        store.setState(partialState);
        store.run.updateCurrentStage();
        itInitializeState = false;

    });

    socket.on(SOCKET_EVENTS.INCOMING_MESSAGE, function (messages) {
        responseToMessage(messages, store);
        var state = store.getState();
        store.setState({messages: [...messages, ...state.messages]});
        addSeparator()
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
        store.run.setOff('isOnline');
    });

    socket.on('reconnect', function () {
        console.log('reconnect');
        store.run.setOn('isOnline');
    });

    socket.on('connect', function () {
        console.log('connect');
        itInitializeState = true;
        store.run.setOn('isOnline');
    });

    console.log('restarted again');

    return {

        /* GENERAL ACTIONS */
        initialize(state, newState) {
            console.log('initialize state');
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
                // const player = Object.assign({}, state.player);
                // player.hand.push(...cards);
                // store.setState({player});
                // animeTakeCards(cards, itInitializeState);
                if(!cards || cards.length === 0) {
                    const deckCard = document.querySelector('.deck');
                    animate(deckCard, 'shake');
                }
            })
        },
        playCard(state, card, cardElement) {

            if (!isCardValid(state, card)) {
                animate(cardElement, 'shake');
            } else {
                card.layRotate = random(-40, 40);
                card.layOrigin = [random(30, 70), random(30, 70)];
                const stack = Object.assign({}, state.stack);
                stack.topCards.unshift(card);
                store.setState({stack});
                animePutCards([card]);
            }
            socket.emit('action:play-card', {card}, function (isSuccess) {

            });
        }
        ,
        endTurn() {
            socket.emit('action:end-turn');
        }
        ,
        selectColor(state, color) {
            socket.emit('action:select-color', {color});
        }
        ,

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
        }
        ,
    }
}
