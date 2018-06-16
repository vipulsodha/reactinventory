import React from 'react';



export default class DateDiv extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="auto-complete-div form-control">
                {this.props.value}
            </div>
        )
    }
}