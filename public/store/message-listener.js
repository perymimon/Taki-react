import React from "react";
import {render} from 'react-dom';

import {animeOtherTakeCard, animeOtherPutCard} from '../utils/measuremens';


export function responseToMessage(messages, store) {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        switch (message.code) {
            case 0/*new game begin*/:return;
            case 100/*drawCards*/:
            case 101/*punishmentCards*/:
                return otherDrawCards(message, store);
            case 10:
                return otherPutCard(message, store);
        }
    }
}

function otherDrawCards(message, store) {
    if (message.private) return;
    const {player, amount} = message.meta;
    animeOtherTakeCard(player);
}

function otherPutCard(message, store) {
    if (message.private) return;
    const {player, amount} = message.meta;
    animeOtherPutCard(player)

}
