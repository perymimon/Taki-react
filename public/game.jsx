import './game.scss';
import React, {Component, Fragment} from "react";
import get from 'lodash/get';
const {GAME_STAGE} = require('../common/game-consts');
import SignInBoard from './boards/signin-board';
import WelcomeBoard from './boards/welcome-board.jsx';
import PlayerList from './component/player-list';
import BoardGame from './component/boardGame';
import Hand from './component/hand';
import Sidebar from './boards/side-bar'


import {connect} from 'unistore/src/combined/react'


export default connect('isOnline, player, gameInProgress, stage')(
    function Game({isOnline, player, gameInProgress, stage}) {
        const customProperties = {
            '--player-color': player && player.color,
        };
        if (!isOnline)
            return <Loading/>;

        return (
            <div className="game"
                 myturn={ get(player,'itHisTurn') + ''}
                 style={customProperties}
            >
                <Stage value={stage}/>
            </div>
        )
    }
);

function Loading() {
    return <div>loading...</div>;
}

function Stage({value}) {
    const stages ={
        [GAME_STAGE.PLAYER_SIGNIN]:<SignInBoard/>,
        [GAME_STAGE.WELCOME]:<WelcomeBoard path="/welcome"/>,
        [GAME_STAGE.GAME_TABLE]:(
            <Fragment>
                <Sidebar/>
                <header className="top-header">
                    <PlayerList/>
                </header>
                <BoardGame/>
                <Hand/>
            </Fragment>)
    };
    return stages[value];
}

