import React from 'react';

import Square from './square.js';
import Token from './token.js';

import findSquare from '../utilities/findSquare.js';

export default class Board extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { width, height, tokens } = this.props;

		const theSquares = squares.map( config => {
			const props = {
				side: config.side,
				top: ( config.top / height ) * 100 + '%',
				left: ( config.left / width ) * 100 + '%',
			};

			return ( <Square { ...props } /> );
		} );

		const theTokens = tokens.map( config => {
			const square = findSquare( squares, config.progress, config.side );

			if ( ! square ) {
				return null;
			}

			const props = {
				side: config.side,
				top: ( square.top / height ) * 100 + '%',
				left: ( square.left / width ) * 100 + '%',
			};

			return ( <Token { ...props } /> );
		} );

		return (
			<div className="ur-board">
				<svg version="1" width={ width * 100 } height={ height * 100 } xmlns="http://www.w3.org/2000/svg"></svg>
				{ theSquares }
				{ theTokens }
			</div>
		);
	}
}
