import './game-layout.scss';
import React, {Fragment} from "react";
import get from 'lodash/get';
import ControlBoard from './boards/control-board';
import {GAME_STAGE} from  '../common/game-consts';
import SignInBoard from './boards/signin-board';
import VictoryBoard from './boards/victory-board';
import WelcomeBoard from './boards/welcome-board.jsx';
import PlayerList from './boards/players-board';
import BoardGame from './boards/game-board';
import Hand from './component/hand';
import Sidebar from './boards/side-bar';

import {connect} from 'unistore/src/combined/react'
import {Preload} from './directives/preload';
import {classnames} from './utils/utils';


function Stage({value, timeLeft, players}) {
    const stages = {
        [GAME_STAGE.PLAYER_SIGNIN]: <SignInBoard/>,
        [GAME_STAGE.WELCOME]: <WelcomeBoard path="/welcome"/>,
        [GAME_STAGE.GAME_TABLE]: (
            <Fragment>
                <header className="top-header">
                    <PlayerList/>
                </header>
                <ControlBoard className="game-background"/>
                <Sidebar/>
                <game-table class="x-game-background">
                    <BoardGame/>
                </game-table>
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

        const classes = classnames({
            [stage]: true,
            'it-his-turn': get(player, 'itHisTurn'),
        });

        return (
            <tk-stage class={classes} style={customProperties}>
                <Stage value={stage} timeLeft={timeLeft} players={players}/>
                <Preload/>
            </tk-stage>
        )
    },
);

function Loading() {
    return <div>loading...</div>;
}

