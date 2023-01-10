import EventEmitter from 'node:events';
import {SOCKET_EVENTS, GAME_SETTING} from '../common/game-consts.js';

const users = {};
var color = "F44336,9C27B0,673AB7,3F51B5,2196f3,03a9f4,00BCD4,009688,4CAF50,8BC34A,cddc39,ffeb3b,ffc107,ff9800,ff5722".split(',');

const {USER_TTL} = GAME_SETTING;
const userEventBus = new EventEmitter();

export class User extends EventEmitter {
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

        });
        this._ttlTimeout = null;
        this._connections = new Set() /*socketsConnection*/;
        this.room = '';
    }

    get public() {
        const userClone = Object.create(User.prototype);
        Object.assign(userClone, this);
        for(let k in userClone){
            if( k[0]==='_'){
                delete userClone[k];
            }
        }
        userClone.hand = this.hand.length;
        return userClone;
    }

    // get room(){
    //     return this.room;
    // }

    disconnect(socket) {
        this._connections.delete(socket);
        if (this._connections.size === 0) {
            this.online = false;
            clearTimeout(this._ttlTimeout);
            this.emit(SOCKET_EVENTS.OFFLINE);
            userEventBus.emit(SOCKET_EVENTS.OFFLINE, this);

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
        this.emit(SOCKET_EVENTS.ONLINE);
        this.emit(SOCKET_EVENTS.CONNECT);
        userEventBus.emit(SOCKET_EVENTS.ONLINE, this);
        userEventBus.emit(SOCKET_EVENTS.CONNECT, this);
        this._connections.add(socket);
    }
    moveRoom(roomName){
        this.exitRoom(this.room);
        this.joinRoom(roomName);
    }
    joinRoom(roomName){
        this.room = roomName;
        this._connections.forEach(socket => socket.join(roomName));
    }
    exitRoom(roomName){
        this._connections.forEach(socket => socket.leave(roomName));
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


function randomColor() {
    var i = (Math.random() * colorPool.length) | 1;
    var color = colorPool.splice(i, 1)[0];
    return '#' + color;
}


// return  '#' + Array(6).fill(0).map( _=> '789abcdef'[(Math.random() * 8) | 1 ] ).join('')
// `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`
