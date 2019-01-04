import React, {Component} from "react";

export default function Icon({className}){
    return <i className={`${'icon'} ${className}`}>
        {Array(27).fill('').map( (e,i)=> <span key={i} className={"path"+(i+1)}></span>)}
    </i>
}