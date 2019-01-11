import Icon from '../component/icon'
import SmallPanelValue from '../directives/small-panel-value';


const get = require('lodash/get');
import './players-board.scss';

import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import {connect} from 'unistore/react'


export default connect('player, players, turn')(
    function PlayersBoard({player, players, turn}) {
        if (!player) return null;
        // players = players.filter( p => p.token != player.token);

        return (
            <player-list>
                <Player player={player} isMain={true}/>

                {players.map((p) => (
                    <Player player={p} isActive={(player.index === turn)} key={player.token}/>
                ))}

            </player-list>
        )
    },
);

function Player({player, isActive, isMain}) {

    const customProperties = {
        '--player-color': player.color,
    };
    const classStyle = [];
    if (isMain) classStyle.push('main');
    if (isActive) classStyle.push('active');

    var hand = (Array.isArray(player.hand) ? player.hand.length : player.hand);


    return <player class={classStyle.join(' ')} style={customProperties}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon={'card-icon'} value={hand}/>
        <SmallPanelValue className="time-left" icon={'icon-gambling'} value={hand}/>
    </player>
}


