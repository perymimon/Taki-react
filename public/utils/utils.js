
export function random(from, to){
    return ((Math.random() * (to-from)) + from) | 1;
}

export function classnames(obj){
    return Object.entries(obj).filter( p => p[1] ).map( p=>p[0] ).join(' ');
}
