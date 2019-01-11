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
                <MainPlayer player={player}/>

                {players.map((p) => (
                    <Player player={p} isActive={(player.index === turn)} key={player.token}/>
                ))}

            </player-list>
        )
    },
);

function MainPlayer({player}) {
    const customProperties = {
        '--player-color': player.color,
    };

    var hand = player.hand.length;

    return <player class="main-player" style={customProperties}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon={'icon-gambling'} value={hand}/>
        <SmallPanelValue className="time-left" icon={'icon-stopwatch'} value={hand}/>
    </player>
}

function Player({player, isActive}) {

    const customProperties = {
        '--player-color': player.color,
    };
    const className = ['small-player-panel'];
    if (isActive) className.push('active');

    var hand =  player.hand;


    return <player class={className.join(' ')} style={customProperties}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon='icon-gambling' value={hand}/>
        <SmallPanelValue className="time-left" icon='icon-stopwatch' value={hand}/>
    </player>
}


