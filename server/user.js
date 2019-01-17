const users = {};
var color = "F44336,9C27B0,673AB7,3F51B5,2196f3,03a9f4,00BCD4,009688,4CAF50,8BC34A,cddc39,ffeb3b,ffc107,ff9800,ff5722,607d8b".split(',');


class User {
    constructor(token, name, slogan, avatar) {
        Object.assign(this, {
            hand: [],
            token,
            color: randomColor(),
            name,
            slogan,
            avatar,
        })
    }

    get public() {
        const userClone = Object.create(User.prototype);
        Object.assign(userClone, this);
        userClone.hand = this.hand.length;
        return userClone;
    }

    toString() {
        return `[${this.name}]`
    }
}

exports.letUser = function (token, {name, slogan, avatar}) {
    users[token] = users[token] || new User(token, name, slogan, avatar);

    // users[token].name = name;
    // users[token].slogan = slogan;
    // users[token].avatar = avatar;

    return users[token];
};
exports.getUsers = () => users;

var colorPool = [...color];

function randomColor() {
    var i = (Math.random() * colorPool.length) | 1;
    var color = colorPool.splice(i, 1)[0];
    return '#' + color;
}


// return  '#' + Array(6).fill(0).map( _=> '789abcdef'[(Math.random() * 8) | 1 ] ).join('')
// `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`
