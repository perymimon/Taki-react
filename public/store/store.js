import {createStore} from 'unistore/src/combined/react'
import devtools from 'unistore/devtools'
import io from "socket.io-client/dist/socket.io.slim.js"

import {storeStateActions,initState} from './store-state-actions';

export const store = devtools(createStore(initState));
export const actions = {};

/*modified store*/
const oldSetState = store.setState;
const subscribe = store.subscribe;
let orginalState = {};
store.setState = function(...args){
    orginalState = store.getState();
    oldSetState.apply(this,args)
};
store.subscribe = function(fn){
    subscribe(function(state,action){
        fn.call(this, [state,orginalState],action);
    })
};

const token = document.cookie.replace(/.*token=(\w+).*/, '$1');
console.log('player token:',token);
console.log('server domain:',process.env.SERVER_DOMAIN);
const socket = io(process.env.SERVER_DOMAIN, {query: {token: token, autoConnect: false}});

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

