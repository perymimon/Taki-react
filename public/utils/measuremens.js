import {animate, rectDiff, resetTransform, resetTransforms} from './utils';


export function measurementPileToCard(pileCards, handCard, throwBottom = true) {
    const gameBoard = document.querySelector('board-game');
    const restores = resetTransforms([pileCards, handCard, gameBoard]);

    const {bottom, top} = rectDiff(pileCards, gameBoard);

    Object.assign(pileCards.style, {
        transform: `translateY(${bottom}px)`,
    });


    const {x, y, right} = rectDiff(pileCards, handCard);

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

export function animeTakeCards(cards, initialize) {
    return new Promise(function (resolve) {
        if (cards.length === 0) return resolve();
        requestAnimationFrame(function () {
            const handCards = document.querySelector('hand-game');
            handCards.style.setProperty('overflow', 'visible');
            const deckCard = document.querySelector('.deck');

            const animesEnds = cards.map((card, i) => {
                const handCard = document.getElementById(card.id);
                const {x, y, z} = measurementPileToCard(deckCard, handCard);
                const animeName = initialize? 'initialize-take-card':'take-card';
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

};


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

        const {bottom, top} = rectDiff(stackCard, gameBoard);

        Object.assign(stackCard.style, {
            transform: `translateY(${bottom}px) scale(0.4)`,
            transformOrigin: 'bottom center',
        });

        const {x, y} = rectDiff(stackCard, cardElement);

        restores();

        animate(stackCard, 'other-put-card', {
            '--corrX': 1 * x + 'px',
            '--corrY': 1 * y + 'px',
            '--corrZ': 1 * bottom + 'px',
        }, callback);
    })

}
