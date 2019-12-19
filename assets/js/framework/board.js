import Emitter from './emitter.js';
import Square from './square.js';

export default class Board extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-board' );

		this.width = config.width;
		this.height = config.height;

		this.el.style.width = this.width * 100 + 'px';
		this.el.style.height = this.height * 100 + 'px';

		this.squares = config.squares.map( squareConfig => {
			var square = new Square( squareConfig );

			this.placeItem( square.el, squareConfig.top, squareConfig.left, 1, 1 );

			return square;
		} );

		this.finalSquare = config.finalSquare;
	}

	findSquare( index, side ) {
		var result = this.squares.filter( square => square.index === index );

		if ( result.length > 1 ) {
			result = result.filter( square => square.side === side );
		}

		return result[0];
	}

	placeItem( el, top, left, width, height ) {
		this.el.appendChild( el );

		if ( typeof top === 'number' ) {
			el.style.top = top * 100 + 'px';
		}
		if ( typeof left === 'number' ) {
			el.style.left = left * 100 + 'px';
		}
		if ( typeof width === 'number' ) {
			el.style.width = width * 100 + 'px';
		}
		if ( typeof height === 'number' ) {
			el.style.height = height * 100 + 'px';
		}
	}

	placeToken( token ) {
		var progress = token.progress;

		// If not in play, abort
		if ( progress < 0 ) {
			return false;
		}

		// Find the applicable square and place it there
		var square = this.findSquare( progress, token.side );
		if ( square ) {
			const capture = square.token;

			// Check if there is a token to capture
			if ( capture ) {
				// Can't capture if own token, abort
				if ( capture.side === token.side ) {
					return false;
				}

				// Can't capture if safe, move ahead
				if ( square.isSafe ) {
					token.advance( 1 );
					return this.place( token );
				}

				// Reset the target token
				square.removeToken( capture );
				capture.reset();
			}

			// Place the token to the square
			square.addToken( token );

			this.placeItem( token.el, square.top, square.left );
		}

		// return
		return square;
	}
}
