import {animate} from './utils';


export function measurement(stackCard, handCard) {
    const gameBoard = document.querySelector('board-game');

    var {transform, transformOrigin} = stackCard.style;

    Object.assign(stackCard.style, {
        // transform: 'rotateX(-45deg)',
        transition: 'none',
        transform:'none',
        transformOrigin: 'bottom',
    });

    Object.assign(gameBoard.style, {
        transform: 'none',
        transition: 'none',
    });

    var stackCardRect = stackCard.getBoundingClientRect();
    var gameBoardRect = gameBoard.getBoundingClientRect();

    var z = gameBoardRect.bottom - stackCardRect.bottom;

    gameBoard.style.removeProperty('transform');

    Object.assign(stackCard.style, {
        transform: `translateY(${z}px) rotateX(-45deg)`,
    });

    var handCardRect = handCard.getBoundingClientRect();
    var stackCardRect = stackCard.getBoundingClientRect();

    var x = handCardRect.left - stackCardRect.left;
    var y = handCardRect.top - stackCardRect.top;

    /*clean up*/

    gameBoard.style.removeProperty('transition');

    // Object.assign(stackCard.style, {
    //     transform: `translateY(${z}px) rotateX(-45deg) translate(${x}px,${y}px)`,
    // });

    Object.assign(stackCard.style, {transform, transformOrigin});
    stackCard.style.removeProperty('transition');

    /*save conclusion*/
    stackCard.style.setProperty('--corrX', x + 'px');
    stackCard.style.setProperty('--corrY', y + 'px');
    stackCard.style.setProperty('--corrZ', z + 'px');


    handCard.style.visibility = 'hidden';
    // stackCard.classList.add('put-card');
    animate(stackCard, 'put-card', function () {
        // removeProperty('--correctionX');
        // removeProperty('--correctionY');
    });
}
