import React, {Component} from "react";
import {TransitionGroup} from 'react-transition-group'
import Transition from 'react-transition-group/Transition';
import Card from './card'
import './hand.scss';

import './select-color.scss';
import {connect} from 'unistore/react';
import {actions} from '../store/store';
import {MODE} from '../../common/game-consts';

function moveto(state) {
    var style = {};
    if(state === 'exiting'){
        var [x, y] = [0, 0];
        const hand = document.querySelector('hand-game');
        const board = document.querySelector('board-game');
        const deck = document.querySelector('.deck');
        style = {
            transform: `translateY(-1.9em) rotateX(12deg) translate(-410px, -189px);`
        }
    }

    return style;
}

function setRelativeCoordinateToStack(card, done) {
    debugger;
    console.log(card, 'leave');
    const stack = document.querySelector('card.stack');
    const stackRect = stack.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    card.style.setProperty('--x', stackRect.bottom - cardRect.bottom);
    card.style.setProperty('--y', stackRect.left - cardRect.left);
    done && done();
}

function Hand({player, turn, selectColor, endTurn, playCard, mode}) {
    return <hand-game style={{color: player.color}}>
        {/*{(mode === MODE.CHANGE_COLOR) ?*/}
            {/*<ColorSelect onSelectColor={(evt) => selectColor(evt.target.dataset.value)}/> : null*/}
        {/*}*/}


        <div className={'title'}>
            {
                (mode === MODE.TAKI) ? <button className={'btn-end-turn'} onClick={endTurn}>end turn</button> : null
            }
            {player.hand.length} cards
        </div>
        <TransitionGroup transitionName="card" component={null}>
            {player.hand.map((card, i) => (
                <Transition timeout={300} key={i}>
                    {state => (
                        <Card card={card}
                              style={moveto(state)}
                              key={`${card.symbol}${card.color}${card.set}`}
                              onClick={() => playCard(card, i)}/>
                    )}

                </Transition>
            ))}
        </TransitionGroup>
    </hand-game>

}

export default connect('turn,players,player,mode'.split(','), actions)(Hand)

function ColorSelect({onSelectColor}) {
    return <color-select>
        <div class="cube" data-color="red" data-value="R" onClick={onSelectColor}/>
        <div class="cube" data-color="blue" data-value="B" onClick={onSelectColor}/>
        <div class="cube" data-color="yellow" data-value="Y" onClick={onSelectColor}/>
        <div class="cube" data-color="green" data-value="G" onClick={onSelectColor}/>
    </color-select>
}
