import Icon from '../directives/icon'
import Card from '../directives/card';

import './players-board.scss';
import {SmallPanelValue} from '../link';

import React from "react";

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
            <player-list class="invisible-scrollbar game-background">


                {players.map((p) => {
                    // if(p.token === player.token){
                    //     return   <MainPlayer player={player} key={p.token}/>
                    // }
                    return <Player player={p}
                                   key={p.token}
                    />
                })}

            </player-list>
        )
    },
);

export function MainPlayer({player}) {
    const customProperties = {
        '--player-color': player.color,
    };

    const className = classnames({
        'main-player': true,
        'active': player.itHisTurn,
        // 'drop-shadow':isActive,
    });

    var hand = player.hand.length;
    var score = player.score || 0;

    return <tk-player-board class={className} style={customProperties}>
        <Icon className={`avatar`} iconName={player.avatar}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-score" value={score}/>
        <SmallPanelValue className="amount-hand-cards" icon={'icon-gambling'} value={hand}>
            <Card/>
        </SmallPanelValue>

    </tk-player-board>
}

export function Player({player}) {

    const customProperties = {
        '--player-color': player.color,
    };
    const className = classnames({
        'small-player-panel': true,
        'active': player.itHisTurn,
        'offline':!player.online
        // 'drop-shadow':isActive,
    });
    var hand = player.hand;
    var score = player.score;

    return <tk-player-board class={className} style={customProperties} id={player.token}>
        <Icon className={`avatar`} iconName={player.avatar}/>
        <div className="player-name dramatic-text">{player.name}</div>
        <div className="player-slogan">{player.slogan}</div>
        <SmallPanelValue className="amount-score" value={score}/>
        <SmallPanelValue className="amount-hand-cards" icon='icon-gambling' value={hand}>
            <Card/>
        </SmallPanelValue>

    </tk-player-board>
}


