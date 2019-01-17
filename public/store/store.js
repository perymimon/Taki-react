import {createStore} from 'unistore/src/combined/react'
import devtools from 'unistore/devtools'
import io from "socket.io-client/dist/socket.io.slim.js"

import {storeStateActions,state} from './store-state-actions';

export const store = devtools(createStore(state));
export const actions = {};


const token = document.cookie.replace(/.*token=(\w+).*/, '$1');
console.log('player token:',token);

const socket = io('localhost:8080', {query: {token: token, autoConnect: false}});

/* bind storeStateActions to store's state */
const boundActions = storeStateActions(store, socket, actions);

for( let [name,action] of Object.entries(boundActions) ){
    actions[name] = store.action(action);
}

store.run = actions;

// store.subscribe(function (state) {
//     if (!state.gameInProgress) {
//         route('/welcome');
//     }else{
//         route('/game')
//     }
// });

socket.open();

