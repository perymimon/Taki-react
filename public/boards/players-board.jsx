import Icon from '../directives/icon'
import Card from '../directives/card';


const get = require('lodash/get');
import './players-board.scss';
import {SmallPanelValue} from '../link';

import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import {connect} from '../link'
import {classnames} from '../utils/utils';


export default connect('player, players, turn')(
    function PlayersBoard({player, players, turn}) {
        if (!player) return null;
        // players = players.filter( p => p.token != player.token);
        // const otherPlayer = players.filter(p => p.token !== player.token);
        setTimeout(function () {
            requestAnimationFrame(function () {
                const playerBoard = document.querySelector('tk-player-board.active');
                playerBoard && playerBoard.scrollIntoView({block:'start',inline:'end'});
            });
        },50);


        return (
            <player-list class="unvisible-scrollbar">


                {players.map((p) => {
                    if(p.token === player.token){
                        return   <MainPlayer player={player} isActive={player.itHisTurn} key={p.token}/>
                    }
                    return <Player player={p}
                                   isActive={p.itHisTurn}
                                   key={p.token}
                    />
                })}

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
        <Icon className={`avatar`} iconName={player.avatar}/>
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
        <Icon className={`avatar`} iconName={player.avatar}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-hand-cards" icon='icon-gambling' value={hand}>
            <Card/>
        </SmallPanelValue>

    </tk-player-board>
}


