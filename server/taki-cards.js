/*
T - Taki
S - Stop
C - Change color
D - Direction
P - Plus
W - +2
*/
const cards = (function () {
    let basicSymbols = "13456789TSDWP".split('');
    let magicSet = "CCCC".split('');
    let basicColor = "RGBY".split('');
    const numberOfSets = 2;
    let cards = [];

    /*  duplicate sets */
    for (let set = 1; set <= numberOfSets; set++) {
        /* create set */
        for (let color of basicColor) {
            const cardsSet = basicSymbols.map(symbol => ({
                symbol, color, set, id: [symbol, color, set].join(''),
            }));
            cards.push(cardsSet);
        }
    }

    const cardsSet = magicSet.map((symbol, index) => ({symbol, color: '', id: [symbol, index].join('')}));
    cards.push(cardsSet);
    // until cards.flat() will come to node;
    return [].concat(...cards);

})();

exports.getNewDeck = getNewDeck;

function getNewDeck() {
    /* shuffle and clone*/
    return cards.sort(_ => Math.random() - 0.5).slice();
}


//↔✋
