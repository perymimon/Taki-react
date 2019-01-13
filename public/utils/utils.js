
export function random(from, to){
    return ((Math.random() * (to-from)) + from) | 1;
}

export function classnames(obj){
    return Object.entries(obj).filter( p => p[1] ).map( p=>p[0] ).join(' ');
}

export function animate(element, animeName, callback) {

    element.classList.add('animated', animeName);

    function animationEndListener(event) {
        if(event.animationName === animeName ){
            element.classList.remove('animated', animeName);
            element.removeEventListener('animationend',animationEndListener);
            callback && callback.call(this,event);
        }
    }

    element.addEventListener('animationend', animationEndListener)
}
