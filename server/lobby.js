import EventEmitter from 'node:events';
import {GAME_EVENTS, GAME_MODE, GAME_SETTING} from '../common/game-consts.js';

export class Lobby extends EventEmitter {
    constructor(game ) {
        super();
        this.users = [];
        this.game = game;
    }

    getUserState(token) {
        const user = this.users.find( user => user.token == token);
        const state = this.game.getPlayerState(user.token);
        return {
            player: user,
            players: this.users.map(p => p.public),
            gameInProgress:state.gameInProgress

        };
    }

    join(user) {
        this.users.push(user);
        user.moveRoom('lobby');
        this.#stateUpdate()
    }

    #stateUpdate(){
        this.emit(GAME_EVENTS.STATE_UPDATE);
    }
    exit(user) {
        const i = this.users.findIndex(u => u === user);
        this.users.splice(i, 1);
        stateUpdate.call(this)
    }
}



