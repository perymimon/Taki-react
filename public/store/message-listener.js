import React from "react";
import {render} from 'react-dom';

import Card from '../directives/card';
import {measurementOtherTakeCard, measurementOtherPutCard} from '../utils/measuremens';


export function responseToMessage(messages, store) {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        switch (message.code) {
            case 1:
                return drawCards(message, store);
            case 10:
                return putCard(message, store);
        }
    }
}

function drawCards(message, store) {
    //todo: if it public not private
    const {player, amount} = message.meta;
    const playerBoard = document.getElementById(player);
    const cardElement = playerBoard.querySelector('tk-card');
    requestAnimationFrame(function () {
        measurementOtherTakeCard(cardElement)
    })

}

function putCard(message,store){
    const {player, amount} = message.meta;
    const playerBoard = document.getElementById(player);
    const cardElement = playerBoard.querySelector('tk-card');
    requestAnimationFrame(function () {
        measurementOtherPutCard(cardElement)
    })

}
