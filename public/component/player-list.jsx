import Icon from './icon'

import './player-list.scss';

import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import {connect} from 'unistore/react'

function playerList({player, players, turn}) {
    if (!player) return null;
    // players = players.filter( p => p.token != player.token);

    return (
        <player-list>
            <Player player={player} isMain={true} ></Player>
            {players.map((p) => (
                <Player player={p} isActive={(player.index === turn)} key={player.token}/>
            ))}
        </player-list>
    )
}


function Player({player,isActive, isMain}) {

    const customProperties = {
        '--player-color': player.color
    };
    const classStyle = [];
    if(isMain) classStyle.push('main');
    if(isActive) classStyle.push('active');

    var hand = (typeof player.hand === 'number') ? player.hand : player.hand.length;


    return <player-game class={classStyle.join(' ')} style={customProperties}>
        <Icon className={`${player.avatar} ${'avatar'}`}/>
        <div className="name dramatic-text">{player.name}</div>
        <div className="slogan">{player.slogan}</div>
        <panel-game class="hand-cards  panel-show-value">
            <Icon className="icon-gambling card-icon"/>
            <text-game>{hand}</text-game>
        </panel-game>
        <panel-game class="time-left panel-show-value">
            <Icon className="icon-gambling card-icon"/>
            <text-game>{hand}</text-game>
        </panel-game>
    </player-game>
}

export default connect(['player', 'players', 'turn'], {})(playerList);