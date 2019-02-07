import './game-layout.scss';
import React, {Component, Fragment} from "react";
import get from 'lodash/get';
import ControlBoard from './boards/control-board';


const {GAME_STAGE} = require('../common/game-consts');
import SignInBoard from './boards/signin-board';
import VictoryBoard from './boards/victory-board';
import WelcomeBoard from './boards/welcome-board.jsx';
import PlayerList from './boards/players-board';
import BoardGame from './boards/game-board';
import Hand from './component/hand';
import Sidebar from './boards/side-bar';

import {connect} from 'unistore/src/combined/react'
import {SmallPanelValue} from './link';


function Stage({value, timeLeft, players}) {
    const stages = {
        [GAME_STAGE.PLAYER_SIGNIN]: <SignInBoard/>,
        [GAME_STAGE.WELCOME]: <WelcomeBoard path="/welcome"/>,
        [GAME_STAGE.GAME_TABLE]: (
            <Fragment>
                <header className="top-header">
                    <PlayerList/>
                </header>
                <ControlBoard/>
                <Sidebar/>
                <BoardGame/>
                <Hand/>
            </Fragment>
        ),
        [GAME_STAGE.VICTORY]: (
            <VictoryBoard players={players}/>
        ),
    };
    return stages[value];
}

// var timeLeftProgress = 100;
// function updateLeftTimeVar(leftTimeProgress){
//     timeLeftProgress = leftTimeProgress;
// }

export default connect('isOnline, player, gameInProgress, stage, timeLeft, players, turn, prevTurn')(
    function Game({isOnline, player, gameInProgress, stage, timeLeft, players, turn, prevTurn}) {
        const customProperties = {
            '--player-color': get(player, 'color'),
            '--current-player-color': get(players, `[${turn}].color`),
            '--prev-player-color': get(players, `[${prevTurn}].color`),
        };
        if (!isOnline)
            return <Loading/>;

        return (
            <tk-stage class={stage}
                     myturn={get(player, 'itHisTurn') + ''}
                     style={customProperties}
            >
                <Stage value={stage} timeLeft={timeLeft} players={players}/>
            </tk-stage>
        )
    },
);

function Loading() {
    return <div>loading...</div>;
}

