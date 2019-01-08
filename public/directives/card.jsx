import React, {Component} from "react";
import './card.scss';
import get from 'lodash/get'

export default function ({card, onClick, className, children}) {

    return  <card className={`${className || ""} ${get(card,'color')}`}
                   onClick={onClick}
                   data-symbol={get(card,'symbol')}>{children}</card>

}
