import React from 'react';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id = "main-container">{this.props.children}</div>
			)
	}
}