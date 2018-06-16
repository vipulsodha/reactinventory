/**
 * Created by Dell-1 on 13-12-2016.
 */
import React from 'react';
import {Link} from 'react-router';


export default class ListEmpty extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <div>   </div>
        )
    }
}