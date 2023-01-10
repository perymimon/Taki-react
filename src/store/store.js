import {createStore} from 'unistore/src/combined/react'
import devtools from 'unistore/devtools' //todo: remove it in production
import io from "socket.io-client"

import {storeStateActions, initState} from './store-state-actions';


export const store = import.meta.env.NODE_ENV === 'production' ?
    createStore(initState) : devtools(createStore(initState));
// export const store = devtools(createStore(initState));
export const actions = {};

/*modified store*/
const oldSetState = store.setState;
const subscribe = store.subscribe;
let orginalState = {};

store.setState = function (...args) {
    orginalState = store.getState();
    oldSetState.apply(this, args)
};
store.subscribe = function (fn) {
    subscribe(function (state, action) {
        fn.call(this, [state, orginalState], action);
    })
};
const env = import.meta.env
const token = 1234;
const socket = io(env.VITE_REMOTE_DOMAIN, {autoConnect: true, extraHeaders:{"session-token":token}});

socket.on('connect', function () {
    console.log('player token:', token);
    console.log('server domain:', env.VITE_REMOTE_DOMAIN);
});
socket.on('disconnected', function (arg) {
    debugger
})
socket.on("connect_error", (error) => {
    console.error(error)
});

/* bind storeStateActions to store's state */
const boundActions = storeStateActions(store, socket, actions);

for (let [name, action] of Object.entries(boundActions)) {
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



