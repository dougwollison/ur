import { h } from 'preact';

import Square from './square.js';
import Token from './token.js';

export default function Board( { width, height, squares, tokens, onPlay } ) {
	function getProps( config ) {
		return {
			...config,
			top: ( config.top / height ) * 100 + '%',
			left: ( config.left / width ) * 100 + '%',
		};
	}

	const theSquares = squares.map( config => {
		return ( <Square { ...getProps( config ) } /> );
	} );

	const theTokens = tokens.map( config => {
		// skip tokens that don't have a position
		if ( typeof config.top === 'undefined' ) {
			return null;
		}

		return ( <Token { ...getProps( config ) } onClick={ () => onPlay( config ) } /> );
	} );

	return (
		<div className="ur-board">
			<svg version="1" width={ width * 100 } height={ height * 100 } xmlns="http://www.w3.org/2000/svg"></svg>
			{ theSquares }
			{ theTokens }
		</div>
	);
}
