import {GAME_SETTING} from '../common/game-consts.js';
/*
T - Taki
S - Stop
C - Change color
D - Direction
P - Plus
W - +2
*/

export class Card {
    constructor(symbol, color, set) {
        Object.assign(this, {
            symbol,
            color,
            set,
            value: isNaN(symbol)? GAME_SETTING.VALUE_OF_SPECIAL_CARDS: +symbol,
            id: [symbol, color, set].join(''),
        })
    }

    toString() {
        return `{${this.symbol}:${this.color}}`
    }

    static toCard({symbol, color, set, layRotate, layOrigin}) {
        const card = new Card(symbol, color, set);
        card.layRotate = layRotate;
        card.layOrigin = layOrigin;
        return card;
    }
}


export const cards = (function createCardsPack() {
    let basicSymbols = "13456789TSDWP".split('');
    let magicSet = "CCCC".split('');
    let basicColor = "RGBY".split('');
    const numberOfSets = 2;
    let cards = [];

    /*  duplicate sets */
    for (let set = 1; set <= numberOfSets; set++) {
        /* create set */
        for (let color of basicColor) {
            const cardsSet = basicSymbols
                .map(symbol => new Card(symbol, color, set));
            cards.push(cardsSet);
        }
    }

    const cardsSet = magicSet.map((symbol,i) => new Card(symbol, 'M', i));

    cards.push(cardsSet);
    // until cards.flat() will come to node;
    return [].concat(...cards);
})();


export function getNewDeck() {
    /* shuffle and clone*/
    return cards.sort(_ => Math.random() - 0.5).slice();
}


//↔✋
