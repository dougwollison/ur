import Emitter from './emitter.js';
import Square from './square.js';

export default class Board extends Emitter {
	constructor( config ) {
		super();

		this.el = document.createElement( 'ur-board' );

		this.width = config.width;
		this.height = config.height;

		this.el.innerHTML = `<svg id="canvas" version="1" width="${config.width * 100}" height="${config.height * 100}" xmlns="http://www.w3.org/2000/svg"></svg>`;

		this.squares = config.squares.map( squareConfig => {
			var square = new Square( squareConfig );

			this.placeItem( square.el, squareConfig.top, squareConfig.left );

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

	placeItem( el, top, left ) {
		this.el.appendChild( el );

		if ( typeof top === 'number' ) {
			el.style.top = ( top / this.height ) * 100 + '%';
		}
		if ( typeof left === 'number' ) {
			el.style.left = ( left / this.width ) * 100 + '%';
		}
	}

	placeToken( token ) {
		var progress = token.progress;

		// If not in play, abort
		if ( progress < 0 ) {
			token.trigger( 'place' );
			return false;
		}

		// If past final square, complete
		if ( progress > this.finalSquare ) {
			token.complete();
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
			token.trigger( 'place' );

			this.placeItem( token.el, square.top, square.left );
		}

		// return
		return square && square.isDouble;
	}
}
