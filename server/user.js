const users = {};
var color = "F44336,9C27B0,673AB7,3F51B5,2196f3,03a9f4,00BCD4,009688,4CAF50,8BC34A,cddc39,ffeb3b,ffc107,ff9800,ff5722".split(',');
const EventEmitter = require('events');

const {SOCKET_EVENTS, GAME_SETTING} = require('../common/game-consts');
const {USER_TTL} = GAME_SETTING;

const userEventBus = new EventEmitter();

class User extends EventEmitter {
    static on(...args){
        userEventBus.on(...args)
    }
    static off(...args){
        userEventBus.off(...args)
    }
    constructor(token, name, slogan, avatar) {
        super();
        Object.assign(this, {
            hand: [],
            token,
            color: randomColor(),
            name,
            slogan,
            avatar,
            connections: new Set(), /*socketsConnection*/
        });
        this._ttlTimeout = null;
        this.room = '';
    }

    get public() {
        const userClone = Object.create(User.prototype);
        Object.assign(userClone, this);
        userClone.hand = this.hand.length;
        return userClone;
    }

    disconnect(socket) {
        this.connections.delete(socket);
        if (this.connections.size === 0) {
            this.online = false;
            clearTimeout(this._ttlTimeout);
            this._ttlTimeout = setTimeout(() => {
                this.disconnected = true;
                this.emit(SOCKET_EVENTS.DISCONNECT);
                userEventBus.emit(SOCKET_EVENTS.DISCONNECT, this);
            }, USER_TTL);
        }
    }

    connect(socket) {
        clearTimeout(this._ttlTimeout);
        this.online = true;
        this.disconnected = false;
        socket.join(this.room);
        this.emit(SOCKET_EVENTS.CONNECT);
        userEventBus.emit(SOCKET_EVENTS.CONNECT, this);
        this.connections.add(socket);
    }
    moveRoom(roomName){
        this.exitRoom(this.room);
        this.joinRoom(roomName);
    }
    joinRoom(roomName){
        this.room = roomName;
        this.connections.forEach( socket => socket.join(roomName));
    }
    exitRoom(roomName){
        this.connections.forEach( socket => socket.leave(roomName));
    }

    set(data) {
        for(var i in data){
            if( !data[i]) continue;
            this[i] = data[i];
        }
    }

    toString() {
        return `[${this.token}]`
    }
}

User.letUser = function (token, {name, slogan, avatar}={}) {
    users[token] = users[token] || new User(token, name, slogan, avatar);

    users[token].set({name, slogan, avatar});
    // users[token].name = name;
    // users[token].slogan = slogan;
    // users[token].avatar = avatar;

    return users[token];
};
User.removeUser = function (token) {
    delete users[token];
};

User.getUsers = () => users;

User.getConnected = function () {
  return Object.entries(users).filter( (k,v)=> !v.disconnected )
};
var colorPool = [...color];

module.exports = User;

function randomColor() {
    var i = (Math.random() * colorPool.length) | 1;
    var color = colorPool.splice(i, 1)[0];
    return '#' + color;
}


// return  '#' + Array(6).fill(0).map( _=> '789abcdef'[(Math.random() * 8) | 1 ] ).join('')
// `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`
