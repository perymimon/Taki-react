import Icon from '../component/icon'
import Card from '../directives/card';


const get = require('lodash/get');
import './players-board.scss';
import {SmallPanelValue} from '../link';

import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import {connect} from 'unistore/react'
import {classnames} from '../utils/utils';


export default connect('player, players, turn')(
    function PlayersBoard({player, players, turn}) {
        if (!player) return null;
        // players = players.filter( p => p.token != player.token);
        const otherPlayer = players.filter( p=> p.token !== player.token);
        return (
            <player-list>
                <MainPlayer player={player} isActive={player.itHisTurn}/>

                {otherPlayer.map((p) => (
                    <Player player={p}
                            isActive={p.itHisTurn}
                            key={p.token}
                    />
                ))}

            </player-list>
        )
    },
);

function MainPlayer({player, isActive}) {
    const customProperties = {
        '--player-color': player.color,
    };

    const className = classnames({
        'main-player': true,
        'active': isActive,
        // 'drop-shadow':isActive,
    });

    var hand = player.hand.length;

    return <tk-player-board class={className} style={customProperties}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon={'icon-gambling'} value={hand}>
            <Card/>
        </SmallPanelValue>
    </tk-player-board>
}

function Player({player, isActive}) {

    const customProperties = {
        '--player-color': player.color,
    };
    const className = classnames({
        'small-player-panel': true,
        'active': isActive,
        // 'drop-shadow':isActive,
    });
    var hand = player.hand;

    return <tk-player-board class={className} style={customProperties} id={player.token}>
        <Icon className={`${player.avatar} avatar`}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon='icon-gambling' value={hand}>
            <Card/>
        </SmallPanelValue>

    </tk-player-board>
}


