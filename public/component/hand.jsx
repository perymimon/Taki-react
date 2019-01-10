import React, {Component} from "react";
import {TransitionGroup} from 'react-transition-group'
import Transition from 'react-transition-group/Transition';
import Card from '../directives/card'
import './hand.scss';
import './select-color.scss';
import {connect} from 'unistore/react';

import {store, actions} from '../store/store';

import {GAME_MODE} from '../../common/game-consts';


export default connect('turn, players, player, mode')(
    function Hand({turn, players, player, mode}) {
        debugger;
        return (
            <hand-game style={{color: player.color}}>
                {/*{(mode === MODE.CHANGE_COLOR) ?*/}
                {/*<ColorSelect onSelectColor={(evt) => selectColor(evt.target.dataset.value)}/> : null*/}
                {/*}*/}

                <div className={'title'}>
                    {
                        (mode === GAME_MODE.TAKI) ?
                            <button className={'btn-end-turn'}
                                    onClick={actions.endTurn}>end turn</button> : null
                    }
                    {player.hand.length} cards
                </div>

                {player.hand.map((card) => (
                    <Card card={card}
                          key={card.id}
                          onClick={() => {
                              actions.playCard(card);
                          }}/>

                ))}
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
