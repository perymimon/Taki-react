import Icon from '../component/icon'
import Card from '../directives/card';

const get = require('lodash/get');
import './players-board.scss';
import {SmallPanelValue} from '../link';

import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import {connect} from 'unistore/react'


export default connect('player, players, turn, timeLeft')(
    function PlayersBoard({player, players, turn, timeLeft}) {
        if (!player) return null;
        // players = players.filter( p => p.token != player.token);

        return (
            <player-list>
                <MainPlayer player={player} timeLeft={timeLeft}/>

                {players.map((p) => (
                    <Player player={p}
                            isActive={p.itHisTurn}
                            key={player.token}
                            timeLeft={timeLeft}/>
                ))}

            </player-list>
        )
    },
);

function MainPlayer({player, timeLeft}) {
    const customProperties = {
        '--player-color': player.color,
    };

    var hand = player.hand.length;

    return <tk-player-board class="main-player" style={customProperties}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon={'icon-gambling'} value={hand}/>
    </tk-player-board>
}

function Player({player, isActive, timeLeft}) {

    const customProperties = {
        '--player-color': player.color,
    };
    const className = ['small-player-panel'];
    if (isActive) className.push('active');

    var hand =  player.hand;


    return <tk-player-board class={className.join(' ')} style={customProperties} id={player.token}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon='icon-gambling' value={hand}/>
        <Card/>
    </tk-player-board>
}


