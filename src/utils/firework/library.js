/**
 * Stores references to the images that
 * we want to reference later on
 */
function image(src){
    const img = new Image();
    img.src = src;
    return img;
}
export const Library = {
    bigGlow: image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAACUSURBVChTldCxEcJADARA10MNtEFMG4Rk1EALRCSOXQWBC3ABhETmViMX8D9zf3One0nzU87e+AVbsAafZpp/ZOr6BgJL8A5ezTRfvcJeMubgGTyCezPNV5erUToo3IJrcGmm+epytZuROgmcg1MzzVeXqxF2NFpHQQfTfHW5sc5DOw/9xtA/u8BLo+wmgGl+6tP+B+soUyWeGS2jAAAAAElFTkSuQmCC'),
    smallGlow: image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAyNi8xMi8xMcZdNcsAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAAATUlEQVQImV3MPQ2AMBQE4K+EnaUOcFAROEAlTjohoDioh7K8JoRbLveb/DDGACnEhoKMjrpGseDAjgeWCHKYZ3CeQY/mFdzmVf0sG+4XEhkRBqSyQ+IAAAAASUVORK5CYII='),
};


