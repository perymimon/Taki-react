export function random(from, to) {
    return ((Math.random() * (to - from)) + from) | 1;
}
export  function randomProps(vars){

    return function generated(){
        const ret = {};
        for(let k in vars){
            const [min,max] = vars[k];
            ret[k] =random(min,max);
        }
        return ret;
    }
}

export function classnames(obj) {
    return Object.entries(obj).filter(p => p[1]).map(p => p[0]).join(' ');
}

export function isPlainObject(candidate) {
    return candidate && (candidate.toString() === "[object Object]")
}

export function animate(element, animeName, vars, callback) {
    if(!(element instanceof Element)){
        throw Error('try to animate none element');
    }
    return new Promise((resolve) => {
        const withCustomVars = isPlainObject(vars);
        if (withCustomVars) {
            Object.entries(vars).forEach(function ([k, v]) {
                element.style.setProperty(k, v);
            });
        }
        element.classList.add('animated', animeName);

        function animationEndListener(event) {
            if (event.animationName === animeName && event.target === element) {
                element.classList.remove('animated', animeName);
                element.removeEventListener('animationend', animationEndListener);

                if (withCustomVars) {
                    Object.keys(vars).forEach(function (k) {
                        // element.style.removeProperty(k)
                    });
                }

                const len = arguments.length - 1;
                if (typeof arguments[len] === 'function') {
                    callback && callback.call(this, event);
                }
                resolve();
            }
        }

        element.addEventListener('animationend', animationEndListener)
    })
}

export function setStyle(element,vars){
    Object.entries(vars).forEach(function ([k, v]) {
        element.style.setProperty(k, v);
    });

    return function clear(){
        Object.keys(vars).forEach(function (k) {
            element.style.removeProperty(k)
        });
    }
}

export function resetTransform(element, overwrite = {}) {
    var {transform, transformOrigin, transition} = element.style;


    Object.assign(element.style, {
        transition: 'none',
        transform: 'none',
        transformOrigin: 'bottom',
    }, overwrite);

    return function unResetTransform() {
        Object.assign(element.style, {
            transform, transformOrigin,
        });
        setTimeout(function () {
            Object.assign(element.style, {
                transition,
            });
        })

    }
}

export function distanceFromXY(element, point){
    const {x, y} = element.getBoundingClientRect();
    return Math.sqrt((point.x-x)*2+(point.y-y)**2);
}

export function resetTransforms(elements, overwrite) {
    const restores = elements.map(function (element) {
        return resetTransform(element, overwrite);
    });

    return function unResetTransforms() {
        restores.forEach(f => f());
    }
}

export function elementRectDiff(from, to) {
    var r1 = from.getBoundingClientRect();
    var r2 = to.getBoundingClientRect();
    return rectDiff(r1, r2);
}

export function rectDiff(r1, r2){
    return {
        x: r2.x - r1.x,
        y: r2.y - r1.y,
        bottom: r2.bottom - r1.bottom,
        top: r2.top - r1.top,
        right: r2.right - r1.right,
        left: r2.left - r1.left,
        width: r2.width - r1.width,
        height: r2.height - r1.height
    };

}

// export function arrayDiff(prev=[], next=[], keyExp) {
//     const add = [], deleted = [];
//     debugger;
//     const prevMap = new Map(prev.map((v) => [get(v, keyExp), v]));
//     const nextMap = new Map(next.map((v) => [get(v, keyExp), v]));
//     prevMap.forEach(function (value, key) {
//         if (!nextMap.has(key)) {
//             deleted.push(value)
//         }
//     });
//     nextMap.forEach(function (value, key) {
//         if (!prevMap.has(key)) {
//             add.push(value)
//         }
//     });
//
//     return {add, deleted}
// }

export function arrayDiff2(prev = [], next = [], keyExp) {
    const prevMap = new Map(prev.map((v) => [v[keyExp], v]));
    const nextMap = new Map(next.map((v) => [v[keyExp], v]));
    prevMap.forEach(function (value, key) {
        if (nextMap.has(key)) {
            prevMap.delete(key);
            nextMap.delete(key);
        }
    });

    return {
        added: [...nextMap.values()],
        deleted: [...prevMap.values()],
    }
}
