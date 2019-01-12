
export function random(from, to){
    return ((Math.random() * (to-from)) + from) | 1;
}
