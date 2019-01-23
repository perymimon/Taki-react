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


export function measurementPutCard(handCard, callback) {
    const stackCard = document.querySelector('.stack tk-card:last-child');
    const {x, y, z} = measurementPileToCard(stackCard, handCard);

    handCard.style.visibility = 'hidden';

    animate(stackCard, 'put-card', {
        '--corrX': x + 'px',
        '--corrY': y + 'px',
        '--corrZ': z + 'px',
    }, callback);
}

export function animeTakeCard(card, callback) {
    requestAnimationFrame(function () {
        const handCard = document.getElementById(card.id);
        const deckCard = document.querySelector('.deck');
        const handCards = document.querySelector('hand-game');
        handCards.style.setProperty('overflow', 'visible');
        const {x, y, z} = measurementPileToCard(deckCard, handCard);
        animate(handCard, 'take-card', {
            '--corrX': -1 * x + 'px',
            '--corrY': -1 * y + 'px',
            '--corrZ': -1 * z + 'px',
        }, function () { //todo: convert it to promise
            handCards.style.removeProperty('overflow');
        });

    });

}

export function measurementOtherTakeCard(card, callback) {
    const deckCard = document.querySelector('.deck');
    const {x, y, z, top, right} = measurementPileToCard(deckCard, card, false);
    animate(card, 'other-take-card', {
        '--corrX': -1 * x + 'px',
        '--corrY': -1 * y + 'px',
        '--corrZ': -1 * z + 'px',
        '--top': top + 'px',
        '--right': -1 * right + 'px',
    }, callback);
}

export function measurementOtherPutCard(card, callback) {

    const stackCard = document.querySelector('.stack tk-card:last-child');
    const gameBoard = document.querySelector('board-game');
    const restores = resetTransforms([stackCard, gameBoard]);

    const {bottom, top} = rectDiff(stackCard, gameBoard);

    Object.assign(stackCard.style, {
        transform: `translateY(${bottom}px) scale(0.4)`,
        transformOrigin: 'bottom center',
    });

    const {x, y} = rectDiff(stackCard, card);

    restores();

    animate(stackCard, 'other-put-card', {
        '--corrX': 1 * x + 'px',
        '--corrY': 1 * y + 'px',
        '--corrZ': 1 * bottom + 'px',
    }, callback);
}
