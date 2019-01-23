const DONE = Symbol('Done');
const thenQueue = Symbol('then queue');
const tickQueue = Symbol('tick queue');
const debugName = Symbol('debug name');
const COOL_NOTIFY_TIMER = Symbol('cool notify timer');



class Timer {
    constructor(time, callback, autostart = false) {
        this.setTime(time);
        this.callback = callback;
        this.timer = null;
        this[thenQueue] = [];
        this[tickQueue] = [];
        this[COOL_NOTIFY_TIMER] = [];
        this.finishedCounter = 0;
        autostart && this.restart();
    }

    stop() {
        clearTimeout(this.timer);
        coolNotify.call(this);
        this.timer = null;
        this.endTime = Date.now();
    }

    setTime(newTime) {
        this.timeLeft = newTime;
        this.resetTime = newTime;
    }

    get timePass() {
        const now = this.timer ? Date.now() : this.endTime;
        return now - this.startTime;
    }
    sync(timeLeft){
        clearTimeout(this.timer);

        if( this.timeLeft > 0 ){
            this.timer = setTimeout(() => {
                handleTimeEnd.call(this);
            }, timeLeft);
        }else{
            if(this.timer){
                handleTimeEnd.call(this);
            }
        }

    }
    restart() {
        clearTimeout(this.timer);
        coolNotify.call(this);
        this[DONE] = false;
        this.startTime = Date.now();
        this.endTime = this.startTime;

        igniteAllNotify.call(this);

        this.timer = setTimeout(handleTimeEnd.bind(this), this.timeLeft);
    }

    pause() {
        this.stop();
    }

    resume() {
        if (this.timer) return;
        let timePass = this.endTime - this.startTime;
        this.timeLeft = this.resetTime - timePass;
        this.restart();
        this.startTime -= timePass;
        this.timeLeft = this.resetTime;
    }

    tick(callback, time) {
        this[tickQueue].push([callback, time]);
        igniteNotify.call(this, callback, time);
    }

    get progress() {
        return (this.timePass / this.resetTime) * 100;
    }

    then(res, rej) {
        this[thenQueue].push(res);
        if (this[DONE]) {
            runThenQueue.call(this)
        }
    }
}

function handleTimeEnd(){
    this.finishedCounter++;
    this.stop();
    this.endTime = this.startTime + this.timeLeft;
    this[DONE] = true;
    this.callback && this.callback();
    this.timeLeft = this.resetTime;
    lastTimeNotify.call(this);
    runThenQueue.call(this);
}

function runThenQueue() {
    this[thenQueue].forEach(callback => callback());
    this[thenQueue] = [];
}

function coolNotify() {
    this[COOL_NOTIFY_TIMER].forEach(clear => clear());
    this[COOL_NOTIFY_TIMER] = [];
}

function igniteNotify(callback, time) {
    let t, me = this;

    requestAnimationFrame(function () {
        /*init callback*/
        callback();
    });

    function cycle() {
        if (!me) return;
        t = setTimeout(() => {
            requestAnimationFrame(function () {
                callback();
                cycle()
            })
        }, time)
    }

    cycle();

    function clear() {
        clearTimeout(t);
    }

    this[COOL_NOTIFY_TIMER].push(clear);
    return clear;
}

function lastTimeNotify() {
    this[tickQueue].forEach(args => args[0/*callback*/]());  //wtf: what that it do ?
}

function igniteAllNotify() {
    return this[tickQueue].map(args => igniteNotify.apply(this, args));
}

/**--------------SIMPLE TIMER------------------**/
 function simpleTimer(callback, time) {
    var cancel = setTimeout(callback, time);
    return function () {
        clearTimeout(cancel);
    }

}


exports.Timer = Timer;
exports.simpleTimer = simpleTimer;
