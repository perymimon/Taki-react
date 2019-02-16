const EventEmitter = require('events');
const {GAME_EVENTS, GAME_MODE, GAME_SETTING} = require('../common/game-consts');


class Lobby extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }

    getUserState(token) {
        const user = this.users.find( user => user.token == token);
        return {
            player: user,
            players: this.users.map(p => p.public),
        };
    }

    join(user) {
        this.users.push(user);
        stateUpdate.call(this)
    }

    exit(user) {
        const i = this.users.findIndex(u => u === user);
        this.users.splice(i, 1);
        stateUpdate.call(this)
    }
}


function stateUpdate() {
    this.emit(GAME_EVENTS.STATE_UPDATE);
}


module.exports = Lobby;
