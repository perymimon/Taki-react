import React, {Component, useState} from "react";
import {TransitionGroup} from 'react-transition-group'
import Transition from 'react-transition-group/Transition';
import {Card} from '../link'
import './hand.scss';
import './select-color.scss';
import {connect} from 'unistore/react';

import {store, actions} from '../store/store';

import {GAME_MODE} from '../../common/game-consts';


function updateSortFn(event) {
    const sortKey = event.target.value;
    const [key, inv] = sortKey.split(' ');

    if (!inv) {
        sortFn = function (a, b) {
            return a[key] > b[key] ? 1 : -1;
        }
    } else {
        sortFn = function (a, b) {
            return b[key] > a[key] ? 1 : -1;
        }
    }
}

let sortFn = (a, b) => a;

function handleCardClick(card) {
    return function (event) {
        actions.playCard(card, event.target);
    }
}

export default connect('turn, players, player, mode')(
    function Hand({turn, players, player, mode}) {

        const playerCardHandSorted = player.hand.slice().sort(sortFn);

        return (
            <hand-game style={{color: player.color}}>

                <div className={'title dramatic-text'}>
                    {
                        (mode === GAME_MODE.TAKI) ?
                            <button className={'btn-end-turn'}
                                    onClick={actions.endTurn}>end turn</button> : null
                    }
                    {player.hand.length} cards
                    <div className="sorting">
                        <tk-text>sort:</tk-text>
                        <button value="symbol" onClick={updateSortFn}>by number</button>
                        <button value="color" onClick={updateSortFn}>by color</button>
                        <button value="symbol inv" onClick={updateSortFn}>by number descending</button>
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
