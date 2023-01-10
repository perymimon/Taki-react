import React from 'react';
import Card from './card';


export  function Preload(){
    const greenCard = {color:'G'},
        redCard={color:'R'},
        yellowCard = {color:'Y'},
        blueCard = {color:'B'};

    const style = {
        position:'absolute',
        top:'-10000px',
        left:'-10000px'
    };

    return <div style={style}>
        <Card card={greenCard}/>
        <Card card={redCard}/>
        <Card card={yellowCard}/>
        <Card card={blueCard}/>
    </div>
}
