import React, {Component, useState} from "react";
import {Card, connect, get} from '../link'
import './hand.scss';
import './select-color.scss';

import {store, actions} from '../store/store';

import {GAME_MODE} from '../../common/game-consts';
import {animeSortHandCard} from '../utils/measuremens';


const sortOrder = new Set();

function addToSort(key) {
    sortOrder.delete(key);
    sortOrder.add(key);
}

function sort(objects) {
    sortOrder.forEach(function (sortKey) {
        const [key, inv] = sortKey.split(' ');
        if (inv)
            objects.sort((a, b) => b[key] > a[key] ? 1 : -1);
        else
            objects.sort((a, b) => a[key] > b[key] ? 1 : -1);
    });
    return objects;
}

// let sortFn = (a, b) => a;

function handleCardClick(card) {
    return function (event) {
        actions.playCard(card, event.target);
    }
}

export default connect('turn, players, player, mode')(
    function Hand({turn, players, player, mode, forceUpdate}) {
        const playerHand = get(player, 'hand', []);
        const playerCardHandSorted = sort(playerHand.slice());

        function updateSort(event) {
            const sortKey = event.target.value;
            addToSort(sortKey);
            forceUpdate();
            animeSortHandCard(playerCardHandSorted);
        }

        return (
            <hand-game>

                <div className={'title dramatic-text'}>
                    {
                        (mode === GAME_MODE.TAKI) ?
                            <button className={'btn-end-turn'}
                                    onClick={actions.endTurn}>end turn</button> : null
                    }
                    {playerHand.length} cards
                    <div className="sorting">
                        <tk-text>sort:</tk-text>
                        <button value="symbol" onClick={updateSort}>by symbol</button>
                        <button value="color" onClick={updateSort}>by color</button>
                        <button value="symbol inv" onClick={updateSort}>by symbol descending</button>
                    </div>
                </div>
                {
                    playerCardHandSorted.map((card) => {
                        return <Card card={card}
                                     key={card.id}
                                     onClick={handleCardClick(card)}/>

                    })
                }
            </hand-game>
        )
    },
)

function ColorSelect({onSelectColor}) {
    return <color-select>
        <div class="cube" data-color="red" data-value="R" onClick={onSelectColor}/>
        <div class="cube" data-color="blue" data-value="B" onClick={onSelectColor}/>
        <div class="cube" data-color="yellow" data-value="Y" onClick={onSelectColor}/>
        <div class="cube" data-color="green" data-value="G" onClick={onSelectColor}/>
    </color-select>
}
