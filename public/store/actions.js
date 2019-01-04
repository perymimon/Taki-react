import io from "socket.io-client/dist/socket.io.slim.js"
import {store} from './store';

export const state = {
    isOnline: false,
    gameInProgress: false,
    player: null,
    // player: {hand: []},
    players: [],
    messages: [],
};


export function actions(store, socket) {


    socket.on('update-game-state', function (partialState) {
        store.setState(partialState);
    });

    socket.on('disconnect', function () {
        store.actions.setOn('isOnline');

    });
    socket.on('reconnect',function(){
        store.actions.setOff('isOnline');
    });

    return {
        /* general actions */
        initialize(state, newState) {
            store.setState(newState, true/*replace state*/)
        },
        setOn(keyName){
            return {[keyName]:true};
        },
        setOff(keyName){
            return {[keyName]:false};
        },

        /*pre game actions*/
        login(state, data) {
            socket.emit('login', data);
        },
        startGame() {
            socket.emit('start');
        },
        readyToPlay(){

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
