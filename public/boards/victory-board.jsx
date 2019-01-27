import './victory-board.scss'
import React from 'react';
import {store,actions} from '../store/store'
import {PlayerName} from '../link';
import {Fireworks} from '../utils/firework/index';


export default function VictoryBoard({players}) {
    players = players.slice().sort( (p1,p2)=> p1.rank - p2.rank);

    setTimeout(function(){
        const fireworks = Fireworks();
        fireworks.initialize('canvas-background-effect').then(function () {
            setInterval(function () {
                fireworks.createParticle();
                fireworks.createParticle();
                fireworks.createParticle();
            },3000);

        });
    },100);


    return (
        <div className="victory-board">
            <h2>Victory</h2>
            <table>
                <tbody>
                {
                    players.map((player,i)=>{
                        return (
                            <tr key={player.token}>
                                <td><tk-text>{i+1}</tk-text></td>
                                <td> <PlayerName name={player.name} /></td>
                                <td>{player.rank}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <canvas id="canvas-background-effect"/>
        </div>
    )
}

