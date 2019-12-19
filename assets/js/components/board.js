import React from 'react';

import Square from './square.js';

export default class Board extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { width, height } = this.props;

		const squares = this.props.squares.map( squareConfig => {
			const config = {
				side: squareConfig.side,
				top: ( squareConfig.top / height ) * 100 + '%',
				left: ( squareConfig.left / width ) * 100 + '%',
			};

			return ( <Square { ...config } /> );
		} );

		return (
			<div className="ur-board">
				<svg version="1" width={ width * 100 } height={ height * 100 } xmlns="http://www.w3.org/2000/svg"></svg>
				{ squares }
			</div>
		);
	}
}
