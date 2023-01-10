import React, {Component} from "react";

export default class Repeat extends Component{
    shouldComponentUpdate(nextProps, nextState){
        return false;
    }
    componentDidMount(){
        var range = new Range();
        range.selectNodeContents(this.base);
        var fragment = range.extractContents();
        this.base.replaceWith(fragment);
        range.detach();

    }
    render({collection}){
        return <fragment>{props.children}</fragment>
    }
}


