import {connect} from 'unistore/react';
import React, {Component} from "react";
import './control-board.scss'
import hosting from '../assets/icons/hosting.html';
import CounterDown from '../directives/counter-down';
import Icon from '../directives/icon';
import {actions, store} from '../store/store';


export default connect('round, endRound')(
    function ControlBoard({className, round, endRound}) {

        const roundsText = `${round} / ${endRound}`;
        return (
            <control-board class={className}>
                <CounterDown/>
                <div name="rounds" className="tk-button">{roundsText}</div>
                <div className="control-icons">
                    <Icon iconName="reset" title="reset game" onClick={actions.resetGame}/>
                    <Icon  iconName="hosting" title="reset server" onClick={actions.resetGame}/>
                    <Icon iconName="exit" title="exit game" onClick={actions.logout}/>


                </div>
            </control-board>
        )
    },
)

