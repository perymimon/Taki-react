import createStore from 'unistore'
import devtools from 'unistore/devtools'
import {actions,state} from './actions';

export const store = devtools(createStore(state));
const token = document.cookie.replace(/.*token=(\w+).*/, (a, b) => b);
const socket = io('localhost:8080', {query: {token: token, autoConnect: false}});
store.actions = {};

/* bind actions to store's state */
for( let name in actions(store, socket)){
    store.actions[name] = store.action(actions[name]);
}
// store.subscribe(function (state) {
//     if (!state.gameInProgress) {
//         route('/welcome');
//     }else{
//         route('/game')
//     }
// });

socket.open();

