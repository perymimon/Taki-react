module.exports = function (socket) {

    return {
        set(value, days){
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000)); // set day value to expiry
            var expires = "; expires="+date.toGMTString();

            socket.handshake.headers.cookie = name+"="+value+expires+"; path=/";
        },
        get(key){
            const cookief  = socket.handshake.headers.cookie;
            const extractValue = new RegExp(`.*${key}=(\\w+).*`);
            return cookief.replace(extractValue, '$1');
        }
    }


}
