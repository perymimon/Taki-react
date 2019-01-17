export function random(from, to) {
    return ((Math.random() * (to - from)) + from) | 1;
}

export function classnames(obj) {
    return Object.entries(obj).filter(p => p[1]).map(p => p[0]).join(' ');
}

export function animate(element, animeName, vars, callback) {
    const withCustromVars = vars && (vars.toString() === "[object Object]");
    if (withCustromVars) {
        Object.entries(vars).forEach(function ([k, v]) {
            element.style.setProperty(k, v)
        });
    }
    element.classList.add('animated', animeName);

    function animationEndListener(event) {
        if (event.animationName === animeName) {
            element.classList.remove('animated', animeName);
            element.removeEventListener('animationend', animationEndListener);

            if (withCustromVars) {
                Object.keys(vars).forEach(function (k) {
                    // element.style.removeProperty(k)
                });
            }

            const len = arguments.length - 1;
            if (typeof arguments[len] === 'function') {
                callback && callback.call(this, event);
            }

        }
    }

    element.addEventListener('animationend', animationEndListener)
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

export function resetTransforms(elements, overwrite) {
    const restores = elements.map(function (element) {
        return resetTransform(element, overwrite);
    });

    return function unResetTransforms() {
        restores.forEach(f => f());
    }
}

export function rectDiff(from, to) {
    var r1 = from.getBoundingClientRect();
    var r2 = to.getBoundingClientRect();
    return {
        x: r2.x - r1.x,
        y: r2.y - r1.y,
        bottom: r2.bottom - r1.bottom,
        top: r2.top - r1.top,
        right: r2.right - r1.right,
        left: r2.left - r1.left,
    };
}
