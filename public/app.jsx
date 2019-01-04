import React, {Component, Fragment} from "react";
import ReactDOM, {render} from 'react-dom';

import './app.scss';
import WelcomeBoard from './component/welcome-board.jsx';
import PlayerList from './component/player-list';
import Boardgame from './component/boardgame';
import Hand from './component/hand';

import {Provider, connect} from 'unistore/react'
import {actions, store} from './store/store';

function Loading() {
    return null;
}

function app({isMyTurn, players, online, player, gameInProgress}) {

    if (!online)
        return null;

    var stage = (function () {
        if (gameInProgress && player) {
            return <Fragment>
                <Boardgame/>
                <Hand/>
            </Fragment>
        } else {
            return <WelcomeBoard path="/welcome"/>
        }
        return
    })();

    return (
        <div className="game" myturn={isMyTurn}>
            <header className="top-header">
                <PlayerList/>
            </header>
            {stage}
        </div>

    )
}

const App = connect(['isMyTurn', 'online', 'player', 'gameInProgress'], actions)(app);

render(<Provider store={store}> <App/></Provider>, document.querySelector('game'));
