import React from 'react';
import {Link} from 'react-router';


export default class Hello extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        console.log(this.state);
    }
    render() {
        console.log(this.props);
        return (
            <div>Hello</div>
        )
    }
}