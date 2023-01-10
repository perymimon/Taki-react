import {
    animate, distanceFromXY,
    elementRectDiff,
    random,
    randomProps,
    rectDiff,
    resetTransform,
    resetTransforms,
    setStyle,
} from './utils';


export function measurementPileToCard(pileCards, handCard, throwBottom = true) {
    const gameBoard = document.querySelector('board-game');
    const restores = resetTransforms([pileCards, handCard, gameBoard]);

    const {bottom, top} = elementRectDiff(pileCards, gameBoard);

    Object.assign(pileCards.style, {
        transform: `translateY(${bottom}px)`,
    });

    const {x, y, right} = elementRectDiff(pileCards, handCard);

    restores();

    return {x, y, z: bottom, top, bottom, right}
}


export function animePutCards(cards, callback) {

    requestAnimationFrame(function () {
        const stackCard = document.querySelector('.stack tk-card:last-child');
        const animeEnds = cards.map((card, i) => {
            const handCard = document.querySelector(`hand-game [id="${card.id}"]`);
            (handCard.style.visibility = 'hidden');
            const {x, y, z} = measurementPileToCard(stackCard, handCard);
            return animate(stackCard, 'put-card', {
                '--corrX': x + 'px',
                '--corrY': y + 'px',
                '--corrZ': z + 'px',
                '--anim-delay': (i * 50) + 'ms',
            })
        });

        Promise.all(animeEnds).then(callback)


    })
}

async function pause(time){
    return new Promise(res => setTimeout(res,time))
}

export async function animeTakeCards(cards, initialize) {
    await pause(10);
    if (cards.length === 0) return null;
    return new Promise(function (resolve) {
        requestAnimationFrame(function () {
            const handCards = document.querySelector('hand-game');
            handCards.style.setProperty('overflow', 'visible');
            const deckCard = document.querySelector('.deck');

            const animesEnds = cards.map((card, i) => {
                const handCard = document.getElementById(card.id);
                const {x, y, z} = measurementPileToCard(deckCard, handCard);
                const animeName = initialize ? 'initialize-take-card' : 'take-card';
                return animate(handCard, animeName, {
                    '--corrX': -1 * x + 'px',
                    '--corrY': -1 * y + 'px',
                    '--corrZ': -1 * z + 'px',
                    '--anim-delay': (i * 50) + 'ms',
                });
            });

            Promise.all(animesEnds).then(function () {
                handCards.style.removeProperty('overflow');
            }).then(resolve)
        });
    })
}

export function animeOtherTakeCard(playerToken, callback) {
    requestAnimationFrame(function () {
        const playerBoard = document.getElementById(playerToken);
        const cardElement = playerBoard.querySelector('tk-card');
        const deckCard = document.querySelector('.deck');
        const {x, y, z, top, right} = measurementPileToCard(deckCard, cardElement, false);
        animate(cardElement, 'other-take-card', {
            '--corrX': -1 * x + 'px',
            '--corrY': -1 * y + 'px',
            '--corrZ': -1 * z + 'px',
            '--top': top + 'px',
            '--right': -1 * right + 'px',
        }, callback);
    })
}

export function animeOtherPutCard(player, callback) {
    requestAnimationFrame(function () {
        const playerBoard = document.getElementById(player);
        const cardElement = playerBoard.querySelector('tk-card');

        const stackCard = document.querySelector('.stack tk-card:last-child');
        const gameBoard = document.querySelector('board-game');
        const restores = resetTransforms([stackCard, gameBoard]);

        const {bottom, top} = elementRectDiff(stackCard, gameBoard);

        Object.assign(stackCard.style, {
            transform: `translateY(${bottom}px) scale(0.4)`,
            transformOrigin: 'bottom center',
        });

        const {x, y} = elementRectDiff(stackCard, cardElement);

        restores();

        animate(stackCard, 'other-put-card', {
            '--corrX': 1 * x + 'px',
            '--corrY': 1 * y + 'px',
            '--corrZ': 1 * bottom + 'px',
        }, callback);
    })

}

export function animeSortHandCard(cards) {
    return new Promise(function (resolve) {
        const originalRects = cards.map(card => {
            const handCard = document.querySelector(`hand-game [id="${card.id}"]`);
            return handCard.getBoundingClientRect();
        });

        requestAnimationFrame(_ => {
            const animusEnds = cards.map((card, i) => {
                const handCard = document.querySelector(`hand-game [id="${card.id}"]`);
                const rect = handCard.getBoundingClientRect();
                const {x, y} = rectDiff(originalRects[i], rect);
                return animate(handCard, 'sort-hand-cards', {
                    '--corrX': -1 * x + 'px',
                    '--corrY': -1 * y + 'px',
                    '--anim-delay': (i * 50) + 'ms',
                })
            });

            Promise.all(animusEnds).then(resolve);

        })
    })
}

export function animeFloatingElement(element, speed) {
    setStyle(element, {
    //     top: '50%',
    //     left: '50%',
        transform: 'translate(50%,50%)',
    });
    const boundaryRect = elementRectDiff(element, element.offsetParent);
    const generated = randomProps({
        x: [0, boundaryRect.width],
        y: [0, boundaryRect.height],
    });

    return function reposition() {
        requestAnimationFrame(function () {
            var {x, y} = generated();
            const time = distanceFromXY(element, {x, y}) / speed;

            setStyle(element, {
                transform: `translate(${x}px,${y}px)`,
                'transition-duration': `${time}s`,
                // top: '0%',
                // left: '0%',
            });
        })
    }


}

export function animeFloatingElements(elements) {
    const speed = 50; // pixel per second
    const interval = 1000;

    const repositions = [...elements].map(el => animeFloatingElement(el, speed));

    const run = () => repositions.forEach(fn => fn());
    run();
    const intId = setInterval(run, interval);

    function stop(){
        clearInterval(intId);
    }

}


// export function animeFloatingElement(elements, contaniner) {
//     // return new Promise(function (resolve, reject) {
//         const conRect = contaniner.getBoundingClientRect();
//         const midX = (conRect.width / 2) | 1;
//         const midY = (conRect.height / 2) | 1;
//         const {width, height} = conRect;
//         const spd = 50; //pixel per sec
//         const interval = 2000;
//
//         const pos = {
//             x:[midX - midX / 2, midX + midX / 2],
//             y:[midY - midY / 2, midY + midY / 2]
//         };
//
//         elements.forEach(function (el) {
//             const x = random(midX - midX / 2, midX + midX / 2);
//             const y = random(midY - midY / 2, midY + midY / 2);
//             setStyle(el, {
//                 transform: `translate(${x}px,${y}px)`,
//             })
//         });
//
//         function setCoordinate(){
//             elements.forEach(function (el) {
//                 const x = random(0, width);
//                 const y = random(0, height);
//                 const time = Math.sqrt(x**2 + y**2) / spd;
//
//                 setStyle(el,{
//                     'transform': `translate(${x}px,${y}px)`,
//                     'transition-duration':`${time}s`
//                 })
//             });
//         }
//
//         setInterval(setCoordinate,interval)
//
//
//     // })
// }
