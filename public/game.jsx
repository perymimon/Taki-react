import React, {Component, Fragment} from "react";
import ReactDOM from 'react-dom';

import './game.scss';
import WelcomeBoard from './component/welcome-board.jsx';
import PlayerList from './component/player-list';
import Boardgame from './component/boardgame';
import Hand from './component/hand';


import {connect} from 'unistore/src/combined/react'

function Loading() {
    return <div>loading...</div>;
}

export const Game = connect('isOnline, player, gameInProgress')(
    function App({isOnline, player, gameInProgress}) {
        if (!isOnline)
            return <Loading/>;

        function Stage() {
            if (gameInProgress && player) {
                return <Fragment>
                    <Boardgame/>
                    <Hand/>
                </Fragment>
            } else {
                return <WelcomeBoard path="/welcome"/>
            }
        }

        return (
            <div className="game" myturn={player.itHisTurn}>
                <header className="top-header">
                    <PlayerList/>
                </header>
                <Stage/>
            </div>
        )
});


