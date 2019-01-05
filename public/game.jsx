import React, {Component, Fragment} from "react";
import ReactDOM from 'react-dom';


const {GAME_STAGE} = require('../common/game-consts');
import './game.scss';
import SignInBoard from './stages/signin-board';
import WelcomeBoard from './stages/welcome-board.jsx';
import PlayerList from './component/player-list';
import BoardGame from './component/boardGame';
import Hand from './component/hand';


import {connect} from 'unistore/src/combined/react'


export default connect('isOnline, player, gameInProgress, stage')(
    function Game({isOnline, player, gameInProgress, stage}) {

        if (!isOnline)
            return <Loading/>;

        return (
            <div className="game" myturn={player.itHisTurn + ''}>
                <header className="top-header">
                    <PlayerList/>
                </header>
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
        [GAME_STAGE.GAME]:(
            <Fragment>
                <BoardGame/>
                <Hand/>
            </Fragment>)
    };
    return stages[value];
}

